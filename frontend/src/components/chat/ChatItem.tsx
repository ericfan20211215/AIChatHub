import { Avatar, Box, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../../context/AuthContext";

function parseMessage(message: string) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: message.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", content: match[2], language: match[1] || "javascript" });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < message.length) {
    parts.push({ type: "text", content: message.slice(lastIndex) });
  }

  return parts;
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();
  const parsed = parseMessage(content);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        px: 2,
        py: 1.5,
        my: 1.5,
        gap: 1.5,
        bgcolor: role === "assistant" ? "#f1f5f9" : "#4A90E2", // Lighter background for assistant and blue for user
        borderRadius: 2,
        maxWidth: "75%",
        alignSelf: role === "assistant" ? "flex-start" : "flex-end",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Avatar
        sx={{
          bgcolor: role === "assistant" ? "#B0BEC5" : "#2C6ED5", // Light gray for assistant, blue for user
          color: role === "assistant" ? "#2C3E50" : "white",
          width: 36,
          height: 36,
          fontSize: 14,
        }}
      >
        {role === "assistant" ? (
          <img src="/openai.png" alt="openai" width="24px" />
        ) : (
          <>
            {auth?.user?.name?.[0]?.toUpperCase()}
            {auth?.user?.name?.includes(" ") && auth?.user?.name.split(" ")[1][0]?.toUpperCase()}
          </>
        )}
      </Avatar>

      <Box sx={{ wordBreak: "break-word" }}>
        {parsed.map((block, idx) =>
          block.type === "code" ? (
            <SyntaxHighlighter
              key={idx}
              language={block.language}
              style={coldarkCold}
              customStyle={{
                borderRadius: 10,
                padding: 12,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {block.content}
            </SyntaxHighlighter>
          ) : (
            <Typography
              key={idx}
              fontSize={15}
              lineHeight={1.6}
              sx={{ mb: 1, whiteSpace: "pre-wrap", color: role === "assistant" ? "#2C3E50" : "white" }}
            >
              {block.content}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;