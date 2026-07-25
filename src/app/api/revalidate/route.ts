import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { validateWebhook } from "@prismicio/client";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const { isValid, secret } = validateWebhook(body, {
    secret: process.env.PRISMIC_WEBHOOK_SECRET,
  });

  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  revalidateTag("prismic");

  return NextResponse.json({ message: "Revalidated." });
}
