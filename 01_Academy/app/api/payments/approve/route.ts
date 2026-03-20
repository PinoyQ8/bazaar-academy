import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID missing. Shield activated." }, { status: 400 });
    }

    // Bridge directly to the Pi Server Adjudicator
    const piApiUrl = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    
    const response = await fetch(piApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}` // Server-side secret key mapped to the .env file
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Pi Server rejected MESH approval." }, { status: 401 });
    }

    // Success: The Adjudicator allows the Pioneer to sign the transaction
    return NextResponse.json({ status: "Approved by Adjudicator" }, { status: 200 });

  } catch (error) {
    console.error("Approval Bridge Error:", error);
    return NextResponse.json({ error: "Internal Bridge error." }, { status: 500 });
  }
}