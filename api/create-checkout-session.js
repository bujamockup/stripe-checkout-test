import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "GET") {
    // For testing in the browser
    res.status(200).json({ message: "API is live ✅" });
    return;
  }

  if (req.method === "POST") {
    try {
      const { priceId } = req.body;

      if (!priceId) {
        res.status(400).json({ error: "Missing priceId in request body" });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: "https://mindful-vacation-279734.framer.app/succes",
        cancel_url: "https://mindful-vacation-279734.framer.app/cancel",
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Stripe error:", err.message);
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // Anything else
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}