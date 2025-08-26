// api/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    // expect: { items: [{ price: 'price_xxx', quantity: 1 }, ...] }
    const { items } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing items" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items,
      success_url: "https:https://mindful-vacation-279734.framer.app/succes={CHECKOUT_SESSION_ID}",
      cancel_url: "https://mindful-vacation-279734.framer.app/cancel",
      allow_promotion_codes: true
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
};