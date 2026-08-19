import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { planName, userEmail } = await req.json();

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id.includes('XXXXXXXX')) {
      return NextResponse.json({
        error: 'Razorpay API keys are missing in .env.local. Please add valid keys.',
      }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Prices in INR (in paise, e.g. 2499 INR = 249900 paise)
    const amountMap: Record<string, number> = {
      Starter: 249900,      // ₹2,499
      'Agency Pro': 699900,  // ₹6,999
      Enterprise: 1499900,  // ₹14,999
    };

    const options = {
      amount: amountMap[planName] || 249900,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planName,
        userEmail: userEmail || '',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}