import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.local.example).')
    return NextResponse.json(
      { error: 'Payments are not configured. Set STRIPE_SECRET_KEY in .env.local.' },
      { status: 503 }
    )
  }

  const stripe = new Stripe(secretKey)

  try {
    const body = await request.json()
    const { lineItems, successUrl, cancelUrl, customerEmail, userId } = body as {
      lineItems: { name: string; quantity: number; amountCents: number; image?: string }[]
      successUrl: string
      cancelUrl: string
      customerEmail?: string
      userId?: string
    }

    if (!lineItems?.length || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing lineItems, successUrl or cancelUrl' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      metadata: userId ? { user_id: userId } : undefined,
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.amountCents),
        },
        quantity: item.quantity,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}
