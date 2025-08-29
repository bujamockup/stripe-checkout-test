import Stripe from "stripe"

// 🔹 Replace with your Stripe Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { priceId } = req.body

  if (!priceId) {
    return res.status(400).json({ error: "Price ID is required" })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_1S07ub6aRPEYIP0bYUzgnaiD, // 🔹 Stripe Price ID from your product
          quantity: 1,
        },
      ],
      mode: "payment",
      // 🔹 Replace these URLs with your published Framer pages
      success_url: "https://numerical-variations-868708.framer.app/success",
      cancel_url: "https://numerical-variations-868708.framer.app/canceled",
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Checkout creation failed" })
  }
}