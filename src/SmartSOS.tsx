import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; 
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Grid,
  Link,
  CssBaseline
} from "@mui/material";
import { useAccount, useSigner } from "wagmi";
import { ConnectKitButton } from "connectkit"; 
import { useNavigate } from "react-router-dom"; 
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#333333', 
    }
  },
});

const SmartSOS: React.FC = () => {
  const [savedIpfsHashes, setSavedIpfsHashes] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>("");
  const [severity, setSeverity] = useState<string>("Low");
  const [emergencyService, setEmergencyService] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string>("");
  const [sosSent, setSosSent] = useState<boolean>(false); 
  const [geminiResponse, setGeminiResponse] = useState<string>(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
    const ipfsHashes = savedUploads.map((upload: { ipfsHash: string }) => upload.ipfsHash);
    setSavedIpfsHashes(ipfsHashes);
  }, []);

  const fetchLocation = async (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser.");
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  };

  const handleGenerateSummary = async (ipfsHash: string) => {
    try {
      setLoading(true);
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      const response = await axios.post("https://ekocare-one.vercel.app/api/summarize-pdf", { ipfsUrl });

      if (response.data.summary) {
        setPdfSummary(response.data.summary);
      } else {
        alert("Error summarizing the document. Please try again.");
      }
    } catch (error) {
      console.error("Error processing record:", error);
      alert("Error while summarizing the record. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendSOS = async () => {
    if (!severity || !emergencyService) {
      alert("Please select a severity level and emergency service type.");
      return;
    }

    setLoading(true);

    try {
      const userLocation = await fetchLocation();
      setLocation(userLocation);

      const sosData = {
        severity,
        location: userLocation,
        ipfsHash: selectedRecord || null,
        pdfSummary: pdfSummary || "No summary available", 
        emergencyService, 
      };

      const response = await axios.post("https://ekocare-one.vercel.app/api/send-sos", sosData);
      const response1 = await axios.post("https://ekocare-one.vercel.app/api/sos-text", sosData);

      if (response.status === 200) {
        setSosSent(true); 
      } else {
        throw new Error("Failed to send SOS.");
      }
      if (response1.status === 200) {
        setGeminiResponse(response1.data.sosText); 
      } else {
        throw new Error("Failed to send SOS.");
      }
    } catch (error) {
      console.error("Error sending SOS:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3, backgroundColor: '#333333', color: 'white' }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#212121", boxShadow: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.5rem", color: "#ffffff" }}>
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
      {!sosSent ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 7 }}>
          <Paper sx={{ padding: 3, width: "100%", maxWidth: 800, boxShadow: 3, borderRadius: 2, backgroundColor: "#444444", color: "white" }}>
            <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3, fontWeight: 700 }}>
              Smart SOS
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">Select a Health Record (Optional):</Typography>
                <Select
                  value={selectedRecord}
                  onChange={(e) => {
                    const selectedHash = e.target.value;
                    setSelectedRecord(selectedHash);
                    if (selectedHash) {
                      handleGenerateSummary(selectedHash); 
                    }
                  }}
                  fullWidth
                  displayEmpty
                  style={{ color: 'white' }}
                >
                  <MenuItem value="">-- None --</MenuItem>
                  {savedIpfsHashes.map((hash, index) => (
                    <MenuItem key={index} value={hash}>
                      {hash}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Select Severity:</Typography>
                <Select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  fullWidth
                  style={{ color: 'white' }}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </Grid>
              {}
              <Grid item xs={12}>
                <Typography variant="body1">Select Emergency Service:</Typography>
                <Select
                  value={emergencyService}
                  onChange={(e) => setEmergencyService(e.target.value)}
                  fullWidth
                  style={{ color: 'white' }}
                >
                  <MenuItem value="">-- Select Service --</MenuItem>
                  <MenuItem value="Ambulance">Ambulance</MenuItem>
                  <MenuItem value="Fire">Fire</MenuItem>
                  <MenuItem value="Police">Police</MenuItem>
                  <MenuItem value="Rescue">Rescue</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendSOS}
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send SOS"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 7 }}>
          <Paper sx={{ padding: 3, maxWidth: 600, width: "100%", borderRadius: 2, backgroundColor: "#444444" }}>
            <Typography variant="h4" color="#ffffff" sx={{ textAlign: "center", fontWeight: 700 }}>
              SOS Sent Successfully!
            </Typography>
            <Box sx={{ padding: 3, backgroundColor: "#444444", borderRadius: 2 }}>
            <Box sx={{ backgroundColor: "#444444", color: "white", borderRadius: 1 }}>
                {}
                <ReactMarkdown>{geminiResponse || "We are processing your request. Please wait..."}</ReactMarkdown>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
      {location && (
        <Box sx={{ marginTop: 4, textAlign: "center" }}>
          <Typography variant="body1">
            Location: Latitude {location.lat}, Longitude {location.lng}
          </Typography>
        </Box>
      )}
      {pdfSummary && (
        <Box sx={{ marginTop: 4, textAlign: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            IPFS Record Summary:
          </Typography>
          <Typography variant="body2">{pdfSummary}</Typography>
        </Box>
      )}
    </Box>
    </ThemeProvider>
  );
};

export default SmartSOS;
