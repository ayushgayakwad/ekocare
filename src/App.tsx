import { WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bscTestnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import UploadPage from "./UploadPage";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AIPage from "./AIPage";
import BookAppointment from "./DoctorRecommendation";
import NearbyDoctorsAndPharmacies from "./NearbyDoctorsAndPharmacies";
import DoctorRecommendation from "./DoctorRecommendation";
import SmartSOS from "./SmartSOS";
import TeamDashboard from "./TeamDashboard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const client = createClient(
  getDefaultClient({
    appName: "EkoCare",
    alchemyId: process.env.ALCHEMY_ID,
    chains: [bscTestnet], 
  })
);

export default function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/ai-driven-disease-prediction" element={<AIPage />} />
              <Route path="/ai-driven-doctor-recommendation" element={<DoctorRecommendation />} />
              <Route path="/nearby" element={<NearbyDoctorsAndPharmacies />} />
              <Route path="/sos" element={<SmartSOS />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
