import mongoose from "mongoose";
import { Server } from "socket.io";

const io = new Server();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/smart-sos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const sosSchema = new mongoose.Schema({
  severity: String,
  location: {
    lat: Number,
    lng: Number,
  },
  ipfsHash: String,
  pdfSummary: String,
  emergencyService: String,
  timestamp: { type: Date, default: Date.now },
});

const SOS = mongoose.model("SOS", sosSchema);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { severity, location, ipfsHash, pdfSummary, emergencyService } = req.body;

    if (!severity || !location || !location.lat || !location.lng) {
      return res.status(400).json({ error: "Incomplete SOS data" });
    }

    try {
      const sosEntry = new SOS({ severity, location, ipfsHash, pdfSummary, emergencyService });
      await sosEntry.save();

      // Emit the new SOS data to all connected clients
      io.emit("new-sos", sosEntry);

      return res.status(200).json({ message: "SOS sent successfully!" });
    } catch (error) {
      console.error("Error saving SOS:", error);
      return res.status(500).json({ error: "Failed to send SOS" });
    }
  } else {
    res.status(405).send({ error: "Method not allowed" });
  }
}
