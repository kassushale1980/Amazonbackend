require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const functions = require("firebase-functions");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5174", // your React frontend port
    credentials: true,
  })
);
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Stripe backend is running");
});

// ✅ Payment route
app.post("/payment/create", async (req, res) => {
  try {
    const total = req.query.total; // total in cents
    console.log("💰 Payment Request Received for amount:", total);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Payment Error:", error);
    res.status(500).send({ error: error.message });
  }
});

// ✅ Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app);
