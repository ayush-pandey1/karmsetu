import { loadStripe } from "@stripe/stripe-js";
import React from "react";

export async function checkout({ lineItems,projectId }) {
    let stripePromise = null;

    const getStripe = () => {
        if (!stripePromise) {
            // Ensure you are using the correct environment variable for the Stripe public key
            stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
        }
        return stripePromise;
    };

    const stripe = await getStripe();

    // Redirect the user to Stripe Checkout
    await stripe.redirectToCheckout({
        mode: "payment",
        lineItems,
        successUrl: `${window.location.origin}/cl/jobs`,
        cancelUrl: window.location.origin
    });
}
