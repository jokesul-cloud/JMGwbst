import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;
      const userId = metadata?.userId;

      if (!userId) {
        return new NextResponse("User ID not found in metadata", { status: 400 });
      }

      if (session.mode === "subscription") {
        // Handle new subscription
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

        const { error } = await supabase.from("subscriptions").insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });

        if (error) {
          console.error("Error inserting subscription:", error);
          return new NextResponse("Database Error", { status: 500 });
        }
      } else if (session.mode === "payment") {
        // Handle one-time purchase
        const seriesId = metadata?.seriesId;

        if (!seriesId) {
          return new NextResponse("Series ID not found in metadata", { status: 400 });
        }

        const { error } = await supabase.from("purchases").insert({
          user_id: userId,
          series_id: seriesId,
          stripe_checkout_id: session.id,
          amount_paid_cents: session.amount_total!,
        });

        if (error) {
          console.error("Error inserting purchase:", error);
          return new NextResponse("Database Error", { status: 500 });
        }
      }
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as any;
      const { error: deleteError } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", deletedSubscription.id);

      if (deleteError) {
        console.error("Error updating subscription status:", deleteError);
        return new NextResponse("Database Error", { status: 500 });
      }
      break;

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as any;
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: updatedSubscription.status,
          current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", updatedSubscription.id);

      if (updateError) {
        console.error("Error updating subscription status:", updateError);
        return new NextResponse("Database Error", { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
