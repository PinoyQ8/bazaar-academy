import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // MESH-SYNC: Accept 'id' from the frontend and map it to the Pi API
    const paymentId = body.paymentId || body.id; 

    if (!paymentId) {
      console.error("MESH ALERT: No Payment ID received in body:", body);
      return NextResponse.json({ error: "Payment ID missing. Shield activated." }, { status: 400 });
    }

    const piApiUrl = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    
    const response = await fetch(piApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Pi Server rejection:", errorData);
      return NextResponse.json({ error: "Pi Server rejected MESH approval." }, { status: 401 });
    }

    return NextResponse.json({ status: "Approved by Adjudicator" }, { status: 200 });

  } catch (error) {
    console.error("Approval Bridge Error:", error);
    return NextResponse.json({ error: "Internal Bridge error." }, { status: 500 });
  }
}