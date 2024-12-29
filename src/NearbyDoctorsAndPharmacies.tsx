import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Button,
  CssBaseline,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { ConnectKitButton } from "connectkit";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const theme = createTheme({
  palette: {
    background: {
      default: '#333333',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d3d3d3',
    },
  },
});

const mapContainerStyle = {
  width: '100%',
  height: '375px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const NearbyDoctorsAndPharmacies = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          alert('Geolocation not available');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && window.google) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
        types: ['doctor', 'pharmacy'],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results || []);
        }
      });
    }
  }, [userLocation]);

  const getMarkerIcon = (placeType: string) => {
    if (placeType === 'doctor') {
      return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    } else if (placeType === 'pharmacy') {
      return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
    return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', color: theme.palette.text.primary, padding: 2 }}>
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

        <Box sx={{ mt: 10, px: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ textAlign: "center", marginBottom: 3, fontWeight: 700}}>
            Nearby Doctors and Pharmacies
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <LoadScript googleMapsApiKey={googleMapsApiKey!} libraries={['places']}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation || { lat: 13.0827, lng: 80.2707 }}
                    zoom={14}
                  >
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        label="You"
                      />
                    )}
                    {places.map((place) =>
                      place.geometry?.location ? (
                        <Marker
                          key={place.place_id}
                          position={place.geometry.location.toJSON()}
                          icon={getMarkerIcon(place.types?.[0] || '')}
                          onClick={() => setSelectedPlace(place)}
                        />
                      ) : null
                    )}
                    {selectedPlace && selectedPlace.geometry?.location && (
                      <InfoWindow
                        position={selectedPlace.geometry.location.toJSON()}
                        onCloseClick={() => setSelectedPlace(null)}
                      >
                        <div>
                          <Typography variant="h6">{selectedPlace.name}</Typography>
                          <Typography>{selectedPlace.vicinity}</Typography>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '400px', overflowY: 'auto', backgroundColor: '#424242', borderRadius: '8px' }}>
                <Typography variant="h6" gutterBottom>
                  Nearby Locations
                </Typography>
                {places.map((place) => (
                  <Card key={place.place_id} sx={{ mb: 2, backgroundColor: '#616161', color: '#ffffff' }}>
                    <CardContent>
                      <Typography variant="h6">{place.name}</Typography>
                      <Typography>{place.vicinity}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NearbyDoctorsAndPharmacies;
