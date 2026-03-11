import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = 'VR-'
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)]
  }
  return s
}

export async function POST(request: NextRequest) {
  const sessionId = (await request.json()).session_id as string | undefined
  if (!sessionId?.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 })
  }

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(stripeSecretKey)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Session not paid' }, { status: 400 })
    }

    const supabaseAdmin = createServiceRoleClient()

    const { data: existing } = await supabaseAdmin
      .from('orders')
      .select('id, order_number')
      .eq('stripe_session_id', sessionId)
      .single()

    if (existing) {
      return NextResponse.json({
        orderId: existing.id,
        orderNumber: existing.order_number,
      })
    }

    const userId = (session.metadata?.user_id as string) || null
    const totalCents = session.amount_total ?? 0
    const orderNumber = generateOrderNumber()

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId || null,
        order_number: orderNumber,
        stripe_session_id: sessionId,
        status: 'CONFIRMED',
        total_cents: totalCents,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    const lineItems = (session as { line_items?: { data?: Array<{ quantity: number; amount_total: number; description?: string }> } }).line_items?.data ?? []
    if (lineItems.length > 0) {
      const rows = lineItems.map((item) => ({
        order_id: order.id,
        product_id: '',
        product_name: item.description ?? 'Item',
        quantity: item.quantity,
        unit_price_cents: Math.round((item.amount_total ?? 0) / item.quantity),
      }))
      const { error: itemsError } = await supabaseAdmin.from('order_items').insert(rows)
      if (itemsError) {
        console.error('Order items insert error:', itemsError)
      }
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
    })
  } catch (err) {
    console.error('Orders sync error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
