import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  export default async function handler(req, res) {
    if (req.method === "POST") {
      const { patientName, specialty, coordinates, bookingType, additionalNotes } = req.body;
  
      if (!coordinates || !coordinates.lat || !coordinates.lon) {
        return res.status(400).send({ error: "Coordinates are required" });
      }
  
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lon}`);
        const data = await response.json(); // Parse the JSON response
        const regionName = data.address?.state_district || data.address?.state || data.address?.county || "Unknown region";
  
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
    } else {
      res.status(405).send({ error: "Method not allowed" });
    }
  }