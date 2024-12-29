const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors()); 
app.use(express.json());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

app.get("/api/sos", async (req, res) => {
  try {
    const sosRecords = await SOS.find().sort({ timestamp: -1 });
    res.status(200).json(sosRecords);
  } catch (error) {
    console.error("Error fetching SOS records:", error);
    res.status(500).json({ message: "Error fetching SOS records." });
  }
});

app.post("/api/send-sos", async (req, res) => {
  const { severity, location, ipfsHash, pdfSummary, emergencyService } = req.body;

  if (!severity || !location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "Incomplete SOS data" });
  }

  try {
    const sosEntry = new SOS({ severity, location, ipfsHash, pdfSummary, emergencyService });
    await sosEntry.save();

    io.emit("new-sos", sosEntry);

    return res.status(200).json({ message: "SOS sent successfully!" });
  } catch (error) {
    console.error("Error saving SOS:", error);
    return res.status(500).json({ error: "Failed to send SOS" });
  }
});

io.on("connection", (socket) => {
  console.log("A team member connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A team member disconnected:", socket.id);
  });
});

const doctors = [
  { "name": "Dr. Arvind Kumar", "specialty": "Cardiologist", "experience": 15, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Priya Reddy", "specialty": "Dermatologist", "experience": 10, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Ravi Patel", "specialty": "Orthopedic", "experience": 12, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Suman Suresh", "specialty": "General Physician", "experience": 8, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Haritha Nair", "specialty": "Pediatrician", "experience": 7, "location": "Kochi, Kerala" },
  { "name": "Dr. Nikhil Verma", "specialty": "ENT Specialist", "experience": 13, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Maya Das", "specialty": "Gynecologist", "experience": 9, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Karthik Reddy", "specialty": "Urologist", "experience": 18, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Lakshmi Prabha", "specialty": "Cardiologist", "experience": 22, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Anjali Joshi", "specialty": "Psychiatrist", "experience": 5, "location": "Mysore, Karnataka" },
  { "name": "Dr. Sunil Raj", "specialty": "Neuro Surgeon", "experience": 20, "location": "Trivandrum, Kerala" },
  { "name": "Dr. Shalini Devi", "specialty": "Dentist", "experience": 6, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Manoj Kumar", "specialty": "Pulmonologist", "experience": 15, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Kavitha Menon", "specialty": "Diabetologist", "experience": 11, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Pradeep Kumar", "specialty": "General Surgeon", "experience": 14, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Swetha R", "specialty": "Pediatrician", "experience": 10, "location": "Kochi, Kerala" },
  { "name": "Dr. Vikas Singh", "specialty": "Neurologist", "experience": 13, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Seema Prakash", "specialty": "OBGYN", "experience": 17, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Ankur Soni", "specialty": "Gastroenterologist", "experience": 9, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Rekha Menon", "specialty": "Plastic Surgeon", "experience": 11, "location": "Trivandrum, Kerala" },
  { "name": "Dr. Anupama Iyer", "specialty": "Dermatologist", "experience": 7, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Arvind Iyer", "specialty": "Orthopedic", "experience": 16, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Radhika Jain", "specialty": "Endocrinologist", "experience": 19, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Jagdish Reddy", "specialty": "ENT Specialist", "experience": 14, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Nishant Sharma", "specialty": "Pediatrician", "experience": 9, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Deepika R", "specialty": "General Surgeon", "experience": 10, "location": "Mysore, Karnataka" },
  { "name": "Dr. Vivek Kumar", "specialty": "Cardiologist", "experience": 12, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Manisha Reddy", "specialty": "Gynecologist", "experience": 8, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Sanjay Rao", "specialty": "Neurologist", "experience": 11, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Ramesh Krishnan", "specialty": "Urologist", "experience": 18, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Latha Suresh", "specialty": "Dentist", "experience": 6, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Amrita Patel", "specialty": "General Physician", "experience": 12, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Rajiv Verma", "specialty": "Pulmonologist", "experience": 10, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Sunita Bhat", "specialty": "Plastic Surgeon", "experience": 14, "location": "Mysore, Karnataka" },
  { "name": "Dr. Bhavana Nair", "specialty": "Psychiatrist", "experience": 9, "location": "Trivandrum, Kerala" },
  { "name": "Dr. Rajendra Iyer", "specialty": "Orthopedic", "experience": 22, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Prachi R", "specialty": "Diabetologist", "experience": 5, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Subash Kannan", "specialty": "ENT Specialist", "experience": 13, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Arun Kumar", "specialty": "General Surgeon", "experience": 10, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Aishwarya Devi", "specialty": "Gastroenterologist", "experience": 8, "location": "Coimbatore, Tamil Nadu" },
  { "name": "Dr. Rakesh Patel", "specialty": "Neuro Surgeon", "experience": 17, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Rekha Sharma", "specialty": "Dentist", "experience": 12, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Ravi Verma", "specialty": "General Physician", "experience": 9, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Parvati Nair", "specialty": "OBGYN", "experience": 10, "location": "Trivandrum, Kerala" },
  { "name": "Dr. Harish Kumar", "specialty": "Orthopedic", "experience": 18, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Manju R", "specialty": "Gynecologist", "experience": 6, "location": "Puducherry, Puducherry" },
  { "name": "Dr. Nisha Bhat", "specialty": "Psychiatrist", "experience": 8, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Preeti Suresh", "specialty": "Pediatrician", "experience": 7, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Suraj Verma", "specialty": "Urologist", "experience": 14, "location": "Madurai, Tamil Nadu" },
  { "name": "Dr. Snehalatha Iyer", "specialty": "Dermatologist", "experience": 9, "location": "Kochi, Kerala" },
  { "name": "Dr. Mukesh Patel", "specialty": "Pulmonologist", "experience": 13, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Sangeetha Devi", "specialty": "Cardiologist", "experience": 15, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Ramya S", "specialty": "Endocrinologist", "experience": 11, "location": "Chennai, Tamil Nadu" },
  { "name": "Dr. Amit Kumar", "specialty": "Plastic Surgeon", "experience": 6, "location": "Mysore, Karnataka" },
  { "name": "Dr. Srilatha Reddy", "specialty": "Dentist", "experience": 14, "location": "Coimbatore, Tamil Nadu" },
  { "name": "Dr. Satish Bhat", "specialty": "General Surgeon", "experience": 12, "location": "Trivandrum, Kerala" },
  { "name": "Dr. Neelam Suresh", "specialty": "Pediatrician", "experience": 9, "location": "Bangalore, Karnataka" },
  { "name": "Dr. Karthika Sharma", "specialty": "Neurologist", "experience": 8, "location": "Hyderabad, Telangana" },
  { "name": "Dr. Deepika Raj", "specialty": "Gastroenterologist", "experience": 10, "location": "Chennai, Tamil Nadu" }
];

app.post("/book-appointment", async (req, res) => {
  const { patientName, specialty, coordinates, bookingType, additionalNotes } = req.body;

  if (!coordinates || !coordinates.lat || !coordinates.lon) {
    return res.status(400).send({ error: "Coordinates are required" });
  }

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lon}`);
    const regionName = response.data.address?.state_district || response.data.address?.state || response.data.address?.county || "Unknown region";

    let prompt = `Find the best doctor for the following patient: 
      Patient Name: ${patientName}
      Specialty: ${specialty || "Any"}
      Booking Type: ${bookingType}
      Additional Notes: ${additionalNotes}
      Location/Region: ${regionName}
      Please suggest the best doctor from the list below and rank them by proximity and relevance to the patient's needs. Give only suggested doctor details strictly and use text styling. Return result in markdown:
      ${doctors.map(doctor => `${doctor.name}, Specialty: ${doctor.specialty}, Experience: ${doctor.experience} years, Location: ${doctor.location}`).join("\n")}`;

    const result = await model.generateContent(prompt);
    const suggestedDoctor = result.response.text();

    res.status(200).json({ suggestedDoctor });
  } catch (error) {
    console.error("Error fetching region name or generating doctor suggestions:", error);
    res.status(500).json({ error: "Failed to generate doctor suggestions" });
  }
});

app.post("/summarize-pdf", async (req, res) => {
  const { ipfsUrl } = req.body;

  if (!ipfsUrl) {
    return res.status(400).send({ error: "IPFS URL is required" });
  }

  try {
    const pdfResponse = await fetch(ipfsUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(pdfBuffer).toString("base64"),
          mimeType: "application/pdf",
        },
      },
      "Summarize this document",
    ]);

    res.json({ summary: result.response.text() });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send({ error: "Error while summarizing the document" });
  }
});

app.post("/predict", async (req, res) => {
  const { symptoms, severity, days, pdfSummary } = req.body;

  if (!symptoms || !severity || !days) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let prompt = `Patient has the following symptoms: ${symptoms}. The severity is ${severity} and the symptoms started ${days} days ago. Predict the disease, give potential reasons and suggest a treatment plan in brief. Give the output in proper markdown language.`;

  if (pdfSummary) {
    prompt += ` The following document content may also be relevant: ${pdfSummary}`;
  }

  try {
    const result = await model.generateContent(prompt);
    res.status(200).json({ prediction: result.response.text() });
  } catch (error) {
    console.error("Error generating prediction:", error);
    res.status(500).json({ error: "Failed to generate prediction." });
  }
});

app.post("/sos-text", async (req, res) => {
  const { severity, location, pdfSummary, emergencyService } = req.body;

  if (!severity || !emergencyService) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let prompt = `Write steps to be taken by a person after sending a SOS with severity ${severity}. The required emergency service was ${emergencyService}. Give the output in proper markdown language.`;

  try {
    const result = await model.generateContent(prompt);
    res.status(200).json({ sosText: result.response.text() });
  } catch (error) {
    console.error("Error generating sosText:", error);
    res.status(500).json({ error: "Failed to generate sosText." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
