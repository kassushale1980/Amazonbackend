const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const stripeLib = require("stripe");

// Load .env only in local
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, ".env") });
}

// Environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const PORT = process.env.PORT || 5000;

// Validate
if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set!");
if (!FIREBASE_PROJECT_ID) throw new Error("FIREBASE_PROJECT_ID not set!");

// Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: FIREBASE_PROJECT_ID,
  });
}

// Stripe
const stripe = stripeLib(STRIPE_SECRET_KEY);

// Express
const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Amazon clone backend is running!"));

// Stripe payment route
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
