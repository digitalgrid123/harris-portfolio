import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-prismic-signature");

  // Validate webhook signature
  const secret = process.env.PRISMIC_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return NextResponse.json(
      { message: "Missing signature or secret." },
      { status: 400 }
    );
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64");

  if (signature !== digest) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  revalidateTag("prismic", "max");

  return NextResponse.json({ message: "Revalidated." });
}
