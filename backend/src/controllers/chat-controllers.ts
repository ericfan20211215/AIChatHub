import { NextFunction, Request, Response } from "express";
import openai from "../config/openai-config.js";
import User from "../models/User.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  const user = await User.findById(res.locals.jwtData.id);

  if (!user)
    return res
      .status(401)
      .json({ message: "User not registered OR Token malfunctioned" });

  // Grab existing chats and add the new user message
  const chats = user.chats.map(({ role, content }) => ({ role: role as 'user' | 'assistant', content }));
  chats.push({ role: "user", content: message });
  user.chats.push({ role: "user", content: message });

  try {
    // Send to OpenAI with the correct structure
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: chats,  
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ message: "AI returned no message" });
    }

    // Save assistant reply
    user.chats.push({ role: "assistant", content: assistantMessage });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ message: "Failed to get AI response", error });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    return res
      .status(200)
      .json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    //@ts-ignore
    user.chats = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "OK"});
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};