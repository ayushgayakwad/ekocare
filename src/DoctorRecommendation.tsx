import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, Paper, Box, Grid, Alert, AppBar, Toolbar, Link, MenuItem, Select, InputLabel, FormControl, CssBaseline  } from '@mui/material';
import ReactMarkdown from 'react-markdown';
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

const DoctorRecommendation = () => {
  const [patientName, setPatientName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bookingType, setBookingType] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [suggestedDoctor, setSuggestedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null);
  const navigate = useNavigate();

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoordinates({ lat: latitude, lon: longitude }); 
        },
        (error) => {
          console.error('Error fetching location:', error);
          setError('Failed to fetch location');
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!coordinates) {
      setError('Location is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/book-appointment', {
        patientName,
        specialty,
        coordinates, 
        bookingType,
        additionalNotes
      });

      setSuggestedDoctor(response.data.suggestedDoctor);
    } catch (err) {
      setError('Failed to fetch doctor suggestions.');
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
      <Box sx={{ padding: 4, display: "flex", justifyContent: "center", alignItems: "center"}}></Box>
      <Paper sx={{ padding: 3, width: "100%", maxWidth: 800, boxShadow: 3, borderRadius: 2, backgroundColor: "#444444", color: "white" }}>
      <Typography variant="h4" color="#ffffff" sx={{ textAlign: "center", marginBottom: 3, fontWeight: 700 }}>
        AI-Driven Doctor Recommendation
      </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                variant="outlined"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor Specialty (Optional)"
                variant="outlined"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel style={{ color: 'white' }}>Booking Type</InputLabel>
                <Select
                  label="Booking Type"
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  required
                  style={{ color: 'white' }}
                >
                  <MenuItem value="Consultation">Consultation</MenuItem>
                  <MenuItem value="Follow-up">Follow-up</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                variant="outlined"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                multiline
                rows={4}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="secondary" /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {suggestedDoctor && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>Suggested Doctor</Typography>
            <Paper sx={{ padding: 2, marginTop: 2, backgroundColor: '#555555', color: 'white' }}>
              <ReactMarkdown children={suggestedDoctor} />
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
    </ThemeProvider>
  );
};

export default DoctorRecommendation;