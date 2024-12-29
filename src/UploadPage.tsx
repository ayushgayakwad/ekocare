import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button, Box, Typography, Card, CardContent, CircularProgress, Divider, AppBar, Toolbar, Link, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useAccount, useSigner } from "wagmi";
import { ConnectKitButton } from "connectkit"; 
import { useNavigate } from "react-router-dom"; 
import { remark } from "remark";
import remarkGfm from "remark-gfm"; 

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

function UploadPage() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [savedWalletAddress, setSavedWalletAddress] = useState<string | null>(null);
  const [savedIpfsHashes, setSavedIpfsHashes] = useState<string[]>([]);
  const [pdfSummary, setPdfSummary] = useState<string>("");
  const [summaryDialogOpen, setSummaryDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleUpload = async () => {
    if (!signer || !pdfFile) {
      alert("Please connect your wallet and select a PDF file.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const pinataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );

      const ipfsHash = pinataResponse.data.IpfsHash;
      console.log("File uploaded to IPFS:", ipfsHash);

      const currentUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
      currentUploads.push({ walletAddress: address, ipfsHash });
      localStorage.setItem("uploads", JSON.stringify(currentUploads));

      setSavedIpfsHashes((prevHashes) => [...prevHashes, ipfsHash]);
      setUploading(false);
      alert("Health record uploaded successfully!");
    } catch (err) {
      setUploading(false);
      console.error("Error uploading file:", err);
      setErrorMessage("Error uploading file. Please try again.");
    }
  };

  const handleSummarize = async (ipfsHash: string) => {
    setUploading(true);
    setErrorMessage("");

    try {
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      const response = await axios.post("https://ekocare-one.vercel.app/api/summarize-pdf", { ipfsUrl });

      if (response.data.summary) {
        setPdfSummary(response.data.summary);
        setSummaryDialogOpen(true);
      } else {
        alert("Error summarizing the document. Please try again.");
      }
    } catch (error) {
      console.error("Error summarizing PDF:", error);
      alert("Error summarizing the document. Please try again later.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const savedAddress = address; 
    if (savedAddress) {
      const savedUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
      const userUploads = savedUploads.filter((upload: { walletAddress: string }) => upload.walletAddress === savedAddress);

      setSavedWalletAddress(savedAddress);
      setSavedIpfsHashes(userUploads.map((upload: { ipfsHash: string }) => upload.ipfsHash));
    } else {
      setSavedWalletAddress(null); 
    }
  }, [address]);

  const handleDelete = (ipfsHash: string) => {
    const currentUploads = JSON.parse(localStorage.getItem("uploads") || "[]");
    const filteredUploads = currentUploads.filter(
      (upload: { walletAddress: string; ipfsHash: string }) => upload.ipfsHash !== ipfsHash
    );
    localStorage.setItem("uploads", JSON.stringify(filteredUploads));

    setSavedIpfsHashes(filteredUploads.map((upload: { ipfsHash: string }) => upload.ipfsHash));
  };

  const renderFilePreviews = () => {
    if (savedWalletAddress === address && savedIpfsHashes.length > 0) {
      return (
        <Box sx={{ marginTop: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ width: "100%" }}>
            Your Uploaded Health Records:
          </Typography>
          {savedIpfsHashes.map((ipfsHash, index) => (
            <Box key={index} sx={{ width: "30%", marginBottom: 2 }}>
              <Card
                sx={{
                  backgroundColor: "#333333", 
                  boxShadow: 3,
                  borderRadius: 2,
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "200px",
                  cursor: "pointer", 
                }}
                onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank")}
              >
                <CardContent>
                  <Typography variant="body1" color="#ffffff" noWrap>
                    IPFS Hash: {ipfsHash}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSummarize(ipfsHash); 
                      }}
                      sx={{ marginBottom: 1 }}
                    >
                      Summarize
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDelete(ipfsHash);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#333333", height: "100vh", textAlign: "center" }}>
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

      <Box sx={{ marginTop: 10 }}>
        <Typography variant="h4" color="#ffffff" sx={{ marginBottom: 4, fontWeight: 700}}>
          Upload your health records (PDF)
        </Typography>

        {}
        <Box sx={{ marginBottom: 2 }}>
          <Button
            variant="outlined"
            component="label"
            sx={{
              backgroundColor: "#424242", 
              borderColor: "#2196f3",
              color: "#2196f3",
              textTransform: "none",
              padding: "10px 30px",
              fontWeight: 600,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              '&:hover': {
                backgroundColor: "#bbdefb",
                borderColor: "#1976d2",
              }
            }}
          >
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              hidden
            />
          </Button>
        </Box>

        {}
        {pdfFile && (
          <Typography variant="body2" color="#ffffff" sx={{ marginTop: 2 }}>
            Selected file: {pdfFile.name}
          </Typography>
        )}

        {}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ marginTop: 2 }}
          disabled={uploading || !pdfFile}
        >
          {uploading ? <CircularProgress size={24} color="secondary" /> : "Upload Health Record"}
        </Button>

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ marginTop: 4 }}>
            {errorMessage}
          </Typography>
        )}

        {renderFilePreviews()}

        <Dialog
          open={summaryDialogOpen}
          onClose={() => setSummaryDialogOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { backgroundColor: "#424242", color: "#ffffff" } }}
        >
          <DialogTitle>Health Report Summary</DialogTitle>
          <DialogContent>
            <ReactMarkdown children={pdfSummary} remarkPlugins={[remarkGfm]} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setSummaryDialogOpen(false)}
              sx={{ color: "#2196f3", "&:hover": { color: "#bbdefb" } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default UploadPage;
