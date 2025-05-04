import { Box, useMediaQuery, useTheme } from "@mui/material";
import TypingAnimation from "../components/typer/TypingAnimation";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      sx={{ overflow: "hidden" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          mt: 3,
          height: "100%",
        }}
      >
        <Box>
          <TypingAnimation />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: isBelowMd ? "column" : "row",
            gap: 5,
            my: 3,
            mt: 2,
          }}
        >
          <Box
            component="img"
            src="robot.png"
            alt="Robot"
            sx={{
              width: isBelowMd ? "100px" : "135px",
              margin: "auto",
              mt: 0,
            }}
          />
          <Box
            component="img"
            className="image-inverted rotate"
            src="openai.png"
            alt="openai"
            sx={{
              width: isBelowMd ? "80px" : "100px",
              margin: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            px: 3,
            mb: 5,
          }}
        >
          <Box
            component="img"
            src="chat.png"
            alt="ChatBot"
            sx={{
              width: isBelowMd ? "90%" : "70%",
              borderRadius: 4,
              boxShadow: "-5px -5px 105px #64f3d5",
              margin: "auto",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;