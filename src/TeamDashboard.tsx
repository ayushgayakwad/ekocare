import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const TeamDashboard: React.FC = () => {
  const [sosRequests, setSosRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; 

  useEffect(() => {
    const fetchSOSRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/sos");
        setSosRequests(response.data);
      } catch (error) {
        console.error("Error fetching SOS requests:", error);
        alert("Failed to fetch SOS requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSOSRequests();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {}
      <AppBar position="static" sx={{ backgroundColor: "#212121" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
            EkoCare SOS Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {}
      <Box sx={{ padding: 4 }}>
        <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" color="primary" sx={{ marginBottom: 2 }}>
            SOS Requests
          </Typography>

          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : sosRequests.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No SOS requests found.
            </Typography>
          ) : (
            <List>
              {sosRequests.map((sos, index) => (
                <React.Fragment key={sos._id}>
                  <ListItem alignItems="flex-start" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ flex: 1 }}>
                      <ListItemText
                        primary={`Severity: ${sos.severity}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textSecondary">
                              Location: Latitude {sos.location.lat}, Longitude {sos.location.lng}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="textSecondary">
                              {sos.ipfsHash ? (
                                <a
                                  href={`https://ipfs.io/ipfs/${sos.ipfsHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: "none", color: "#1976d2" }}
                                >
                                  IPFS Hash: {sos.ipfsHash}
                                </a>
                              ) : (
                                "IPFS Hash: N/A"
                              )}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="textSecondary">
                              Summary: {sos.pdfSummary || "N/A"}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="textSecondary">
                              Timestamp: {new Date(sos.timestamp).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="textSecondary">
                              Service: {sos.emergencyService || "Undefined"}
                            </Typography>
                          </>
                        }
                      />
                    </Box>

                    {}
                    <Box sx={{ width: 150, height: 150, borderRadius: 2, boxShadow: 2 }}>
                      <LoadScript googleMapsApiKey={googleMapsApiKey!}>
                        <GoogleMap
                          mapContainerStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "8px",
                          }}
                          center={{
                            lat: sos.location.lat,
                            lng: sos.location.lng,
                          }}
                          zoom={10}
                        >
                          <Marker
                            position={{
                              lat: sos.location.lat,
                              lng: sos.location.lng,
                            }}
                          />
                        </GoogleMap>
                      </LoadScript>
                    </Box>
                  </ListItem>
                  {index < sosRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TeamDashboard;
