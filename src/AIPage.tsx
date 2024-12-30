import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAccount, useSigner } from "wagmi";
import { ConnectKitButton } from "connectkit"; 
import { useNavigate } from "react-router-dom";
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
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Link,
} from "@mui/material";
import { remark } from "remark";
import remarkGfm from "remark-gfm";

const AIPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>("");
  const [severity, setSeverity] = useState<string>("Mild");
  const [days, setDays] = useState<number>(1);
  const [prediction, setPrediction] = useState<string>("");
  const [pdfSummary, setPdfSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedIpfsHashes, setSavedIpfsHashes] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
    const ipfsHashes = savedUploads.map((upload: { ipfsHash: string }) => upload.ipfsHash);
    setSavedIpfsHashes(ipfsHashes);
  }, []);

  const handlePredict = async () => {
    if (!symptoms || !severity || !days) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const data: any = { symptoms, severity, days };

      if (pdfSummary) {
        data["pdfSummary"] = pdfSummary;
      }

      const response = await axios.post("http://localhost:3000/predict", data);

      if (response.data.prediction) {
        setPrediction(response.data.prediction);
      } else {
        alert("No prediction received from the server.");
      }
    } catch (error) {
      console.error("Error fetching AI prediction:", error);
      alert("Error while predicting the disease. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSelection = async () => {
    if (!selectedRecord) {
      alert("Please select a record.");
      return;
    }

    setLoading(true);

    try {
      const ipfsUrl = `https://ipfs.io/ipfs/${selectedRecord}`;
      const response = await axios.post("http://localhost:3000/summarize-pdf", { ipfsUrl });

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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#333333", color: "white" }}>
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
      <Box sx={{ padding: 4, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 7}}>
        <Paper sx={{ padding: 3, width: "100%", maxWidth: 800, boxShadow: 3, borderRadius: 2, backgroundColor: "#444444", color: "white" }}>
          <Typography variant="h4" color="#ffffff" sx={{ textAlign: "center", marginBottom: 3, fontWeight: 700}}>
            AI-Driven Disease Prediction
          </Typography>

          {}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" color="#ffffff" sx={{ marginBottom: 1 }}>
              Enter Symptoms:
            </Typography>
            <TextField
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., fever, headache, sore throat..."
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
              sx={{ marginBottom: 2, backgroundColor: "#555555", color: "white" }}
              InputProps={{ style: { color: "white" } }}
            />
          </Box>

          {}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" color="#ffffff" sx={{ marginBottom: 1 }}>
                Select Severity:
              </Typography>
              <Select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#555555", color: "white" }}
                inputProps={{ style: { color: "white" } }}
              >
                <MenuItem value="Mild">Mild</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Severe">Severe</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="#ffffff" sx={{ marginBottom: 1 }}>
                Number of Days:
              </Typography>
              <TextField
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                variant="outlined"
                fullWidth
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{ backgroundColor: "#555555", color: "white" }}
              />
            </Grid>
          </Grid>

          {}
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" color="#ffffff" sx={{ marginBottom: 1 }}>
              Select a Health Record (Optional):
            </Typography>
            <Select
              value={selectedRecord}
              onChange={(e) => setSelectedRecord(e.target.value)}
              fullWidth
              displayEmpty
              variant="outlined"
              sx={{ marginBottom: 2, backgroundColor: "#555555", color: "white" }}
              inputProps={{ style: { color: "white" } }}
            >
              <MenuItem value="">-- Select a record --</MenuItem>
              {savedIpfsHashes.map((hash, index) => (
                <MenuItem key={index} value={hash}>
                  {hash}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handlePredict}
            fullWidth
            disabled={loading}
            sx={{ marginTop: 3 }}
          >
            {loading ? <CircularProgress size={24} color="secondary" /> : "Predict Disease"}
          </Button>

          {}
          {prediction && (
            <Box sx={{ marginTop: 3 }}>
              <Divider sx={{ marginBottom: 2 }} />
              <Typography variant="h6" color="#ffffff">
                Predicted Disease:
              </Typography>
              <Box sx={{ marginTop: 1 }}>
                <ReactMarkdown
                  children={prediction}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <Typography variant="body1" color="#ffffff" sx={{ marginBottom: 2 }}>
                        {children}
                      </Typography>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AIPage;