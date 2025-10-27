const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());

// Example route for Stripe
app.post("/create-payment-intent", async (req, res) => {
  const { total } = req.query;
  // Use your Stripe secret key
  const stripe = require("stripe")(process.env.STRIPE_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

module.exports = { api: app };
