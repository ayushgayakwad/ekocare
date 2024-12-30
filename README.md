# EkoCare 

## Overview
**EkoCare** is a cutting-edge health suite designed to make managing your wellness effortless. By leveraging advanced AI, blockchain, and Web3 technologies, EkoCare provides an all-in-one solution for health management. From securely storing and summarizing health records to offering AI-powered disease predictions and doctor recommendations, EkoCare is built to simplify and enhance your healthcare experience. 

With features like Smart SOS for emergencies and tools for locating nearby healthcare providers, EkoCare ensures you're always connected to the care you need, when you need it. Whether you're an individual seeking personalized health insights or a rescue team managing emergency requests, EkoCare has you covered.

## Features
- **Sign in with Web3 Wallet:** Seamlessly log in using your Web3 wallet for secure and decentralized authentication.
- **Secure Health Record Storage:** Store your health records securely using IPFS and blockchain technology, ensuring privacy and integrity.
- **AI-Powered Health Record Summary:** Upload health records to receive a detailed AI-generated summary for quick insights.
- **AI-Powered Disease Prediction:** Input symptoms to get accurate AI-driven predictions for potential diseases.
- **AI-Powered Doctor Finder:** Discover doctors based on symptoms, relevance, and location proximity, using advanced AI algorithms.
- **Smart SOS:** Send an emergency SOS to the rescue team with critical details for immediate assistance.
- **Rescue Team Dashboard:** A comprehensive dashboard for rescue teams to review and respond to SOS requests effectively.
- **Nearby Doctors and Pharmacies Finder:** Locate nearby doctors and pharmacies based on your current location for quick access to healthcare services.

## Project Structure

```
ekocare/
├── public/
│   └── index.html
├── server/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── App.tsx
│   ├── Home.tsx
│   ├── AIPage.tsx
│   ├── AIPage.css
│   ├── DoctorRecommendation.tsx
│   ├── index.tsx
│   ├── NearbyDoctorsAndPharmacies.tsx
│   ├── SmartSOS.tsx
│   ├── TeamDashboard.tsx
│   └── UploadPage.tsx
├── .env
├── package.json
├── package-lock.json
└── tsconfig.json
```


## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org) (with npm)

## Getting Started
Follow these steps to run the project locally:

1. Clone the repository:

   ```
   git clone https://github.com/ayushgayakwad/ekocare.git
   cd ekocare
   ```

2. Install dependencies:
   * In the root directory:
     
     ```
     npm install
     ```
   * Navigate to the `server/` folder:

     ```
     cd server
     npm install
     ```

3. Start the server:
   
   ```
   node server.js
   ```

4. In a new terminal, navigate back to the root directory and start the React app:
   ```
   cd ekocare
   npm start
   ```

5. Open the app in your browser at `http://localhost:3000`

## Environment Variables
Create a `.env` file in the root directory to configure environment-specific variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/smart-sos
REACT_APP_PINATA_API_KEY=
REACT_APP_PINATA_SECRET_API_KEY=
GOOGLE_API_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=
```

## License
This project is licensed under the [GNU General Public License v3](https://github.com/ayushgayakwad/ekocare/blob/main/LICENSE)
