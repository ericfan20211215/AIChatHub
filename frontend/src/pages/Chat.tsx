import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/chat/ChatItem";
import { useAuth } from "../context/AuthContext";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content) return;
    if (inputRef.current) inputRef.current.value = "";

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting chats...", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Chats deleted successfully", { id: "deletechats" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading chats...", { id: "loading-chats" });

      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Chats loaded successfully", {
            id: "loading-chats",
            duration: 2000,
          });
        })
        .catch((err) => {
          toast.error("Failed to load chats", {
            id: "loading-chats", 
          });
          console.error("Loading Failed", err);
        });
    }
  }, [auth]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth?.user) {
        navigate("/login");
      }
    };
  
    checkAuth();
  }, [auth?.user, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#1E2A47",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: { md: "flex", xs: "none" },
          width: 200,
          maxHeight: "100vh",
          bgcolor: blueGrey[800],
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 2,
          py: 3,
          gap: 2,
          overflowY: "auto",
        }}
      >
        <Avatar
          sx={{
            bgcolor: lightBlue[600],
            color: "white",
            fontWeight: 700,
            width: 56,
            height: 56,
            fontSize: 26,
            mt: 1,
          }}
        >
          {auth?.user?.name
            ?.split(" ")
            .map((word) => word?.[0]?.toUpperCase())
            .slice(0, 2)
            .join("") || "AI"}
        </Avatar>

        <Typography
          variant="h6"
          fontFamily="Inter, sans-serif"
          textAlign="center"
          color="white"
          fontWeight={600}
          fontSize={16}
          mt={1}
        >
          Chat with AI
        </Typography>

        <Typography
          fontFamily="Inter, sans-serif"
          textAlign="center"
          fontSize={12}
          mt={1}
          mb={2}
          color="grey.400"
        >
          Ask anything, anytime. Whether you're exploring ideas, solving a
          problem, or just curious — your AI assistant is here 24/7 to help with
          insights, answers, and support.
        </Typography>

        <Button
          onClick={handleDeleteChats}
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#e53935",
            "&:hover": {
              bgcolor: "#b71c1c",
            },
            borderRadius: 2,
            py: 1.2,
            px: 2,
            fontSize: 15,
            transition: "0.3s ease-in-out",
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "#0f172a",
          px: { xs: 2, md: 3 },
          overflow: "hidden",
        }}
      >
        <Box sx={{ py: 2 }}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            fontSize={{ xs: 24, md: 32 }}
            color="white"
            fontFamily="'Roboto', sans-serif"
            sx={{
              letterSpacing: "2px",
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.6)",
            }}
          >
            MERNverse GPT
          </Typography>
        </Box>
        <Box
          sx={{
            height: "65vh",
            width: 1000,
            mx: "auto",
            p: 2,
            mb: 3,
            bgcolor: "#1E2A47",
            borderRadius: 3,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <Box
          sx={{
            width: 1000,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1E2A47",
            borderRadius: 3,
            mx: "auto",
            px: 2,
            py: 1,
            mt: 1,
            mb: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask something..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              outline: "none",
              fontSize: 14,
              padding: "8px 0",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{
              color: "white",
              backgroundColor: lightBlue[600],
              borderRadius: 2,
              ml: 2,
              ":hover": { backgroundColor: lightBlue[700] },
            }}
          >
            <IoMdSend size={22} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
