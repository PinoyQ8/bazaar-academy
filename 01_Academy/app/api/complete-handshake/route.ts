import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse the MESH payload (paymentId and txid are required here)
    const body = await request.json();
    // MESH-SYNC: Accept either 'paymentId' or 'id' for maximum reliability
    const paymentId = body.paymentId || body.id; 
    const txid = body.txid;

    if (!paymentId || !txid) {
      console.error("MESH Error: Missing paymentId or txid. Body received:", body);
      return NextResponse.json(
        { error: "Payload Malformed. paymentId or txid missing." }, 
        { status: 400 }
      );
    }

    // 3. Handshake: Notify Pi Network that the transaction is finalized
    // Note: Completion uses 'Authorization': 'Key <API_KEY>', not 'Bearer'
    const piCompleteUrl = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    
    const response = await fetch(piCompleteUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const result = await response.json();

    if (response.ok) {
      console.log("MESH Handshake Confirmed:", paymentId);
      return NextResponse.json({ status: "Complete", txid }, { status: 200 });
    } else {
      console.error("Pi Server Rejected Completion:", result);
      return NextResponse.json(
        { error: "Pi Server rejected the final handshake." }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Critical Adjudicator Failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error during handshake." }, 
      { status: 500 }
    );
  }
}