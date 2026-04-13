import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Resend } from 'resend';
import { render } from '@react-email/render';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const orderId = session.metadata.orderId;

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          status: 'Processing',
          paidAt: new Date(),
          paymentResult: JSON.stringify({
            id: session.id,
            status: session.payment_status,
            email: session.customer_details?.email,
          })
        },
        include: { orderItems: true }
      });

      const customerEmail = JSON.parse(updatedOrder.shippingAddress || '{}').email;
      const emailHtml = await render(OrderReceiptEmail({ order: updatedOrder }));

      await resend.emails.send({
        from: 'My E-Shop <onboarding@resend.dev>',
        to: customerEmail,
        subject: `Order Confirmation #${updatedOrder.id.slice(-8).toUpperCase()}`,
        html: emailHtml,
      });

      console.log(`✅ Webhook: Order ${orderId} Paid & Email Sent!`);
    } catch (error) {
      console.error("Webhook DB/Email Error:", error);
      return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
    }
  }
  return NextResponse.json({ message: 'Success' }, { status: 200 });
}
