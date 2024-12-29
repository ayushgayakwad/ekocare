import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Box, Typography, Button, AppBar, Toolbar, Container, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  return  (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #000000, #4c006d)",
        color: "white", 
        fontFamily: "Poppins, sans-serif", 
      }}
    >
      {}
      <AppBar position="fixed" sx={{ backgroundColor: "#212121", boxShadow: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              EkoCare
            </Typography>
          </Box>

          {}
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <Link
              component="button"
              variant="body2"
              sx={{
                color: "#d3d3d3",
                margin: "0 16px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "300", 
                "&:hover": { color: "#5e35b1" },
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "#d3d3d3",
                margin: "0 16px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "300",
                "&:hover": { color: "#5e35b1" },
              }}
              onClick={() => navigate("/upload")}
            >
              Upload Records
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "#d3d3d3", 
                margin: "0 16px",
                textDecoration: "none",
                fontSize: "0.875rem", 
                fontWeight: "300",
                "&:hover": { color: "#5e35b1" },
              }}
              onClick={() => navigate("/ai-driven-disease-prediction")}
            >
              Disease Prediction
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "#d3d3d3",
                margin: "0 16px",
                textDecoration: "none",
                fontSize: "0.875rem", 
                fontWeight: "300", 
                "&:hover": { color: "#5e35b1" },
              }}
              onClick={() => navigate("/ai-driven-doctor-recommendation")}
            >
              Find Doctors
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "#d3d3d3", 
                margin: "0 16px",
                textDecoration: "none",
                fontSize: "0.875rem", 
                fontWeight: "300", 
                "&:hover": { color: "#5e35b1" },
              }}
              onClick={() => navigate("/nearby")}
            >
              Nearby Help
            </Link>
          </Box>

          {}
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  backgroundColor: "#7e57c2",
                  "&:hover": { backgroundColor: "#5e35b1" },
                  borderRadius: 1,
                  padding: "6px 24px", 
                  fontSize: "0.7rem", 
                }}
                onClick={show}
              >
                {isConnected ? "Connected" : "Connect Wallet"}
              </Button>
            )}
          </ConnectKitButton.Custom>
        </Toolbar>
      </AppBar>

      {}
      <Container
  sx={{
    paddingTop: 10,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  }}
>
  {}
  <Typography
    variant="h2"
    sx={{
      fontWeight: "700",
      color: "white",
      marginBottom: 2, 
      fontFamily: "Poppins, sans-serif", 
      textTransform: "uppercase", 
    }}
  >
    Welcome to EkoCare
  </Typography>

  {}
  <Typography
    variant="body1"
    sx={{
      color: "white",
      marginBottom: 3, 
      maxWidth: "600px",
      textAlign: "center",
      margin: "0 auto",
      lineHeight: "1.6",
      fontFamily: "Poppins, sans-serif",
      fontSize: "1.1rem", 
      fontWeight: "300", 
    }}
  >
    Your all-in-one health suite for managing your wellness effortlessly, with cutting-edge AI-driven solutions for prediction and care.
  </Typography>

  {}
  <Button
    variant="contained"
    color="error"
    sx={{
      fontSize: "1.2rem", 
      padding: "18px 40px",
      borderRadius: 8, 
      boxShadow: 6, 
      backgroundColor: "#d32f2f", 
      "&:hover": {
        backgroundColor: "#b71c1c",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", 
      },
      transition: "all 0.3s ease", 
      marginTop: 5, 
    }}
    onClick={() => navigate("/sos")}
  >
    Smart SOS
  </Button>
</Container>

    </Box>
  );
}

export default Home;
