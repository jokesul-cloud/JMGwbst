import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { seriesId, priceId, mode } = await req.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let unitAmount: number | undefined;
    let metadata: any = { userId: user.id };

    if (mode === "payment") {
      if (!seriesId) {
        return new NextResponse("Series ID is required for one-time payments", { status: 400 });
      }

      // Fetch series details to get the price
      const { data: series, error: seriesError } = await supabase
        .from("series")
        .select("price_cents")
        .eq("id", seriesId)
        .single();

      if (seriesError || !series) {
        return new NextResponse("Series not found", { status: 404 });
      }

      unitAmount = series.price_cents;

      // Check for active subscription to apply discount
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (subscription && unitAmount) {
        // Apply 40% discount
        unitAmount = Math.round(unitAmount * 0.6);
      }

      metadata.seriesId = seriesId;
    }

    const sessionOptions: any = {
      line_items: [
        mode === "subscription" 
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Golf Splooch Video Series", // Ideally fetch series title
                },
                unit_amount: unitAmount,
              },
              quantity: 1,
            },
      ],
      mode: mode,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/my-library?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: metadata,
      customer_email: user.email,
    };

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Session Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
