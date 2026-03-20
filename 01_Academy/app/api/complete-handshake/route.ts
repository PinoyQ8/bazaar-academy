import { NextResponse } from 'next/server';

// 1. Hard-Code the expected Pi Network Sandbox API response
interface PiUserResponse {
  uid: string;
  username: string;
}

export async function POST(request: Request) {
  try {
    // Parse the payload from the client-side RAM buffer
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access Token missing from Bridge request. Shield activated." }, 
        { status: 400 }
      );
    }

    // 2. Adjudicator Logic: Verify token securely via server-to-server Bridge
    const piVerifyUrl = "https://api.minepi.com/v2/me";
    
    const verifyResponse = await fetch(piVerifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!verifyResponse.ok) {
      // The token was rejected by the Sandbox. Intrusion blocked.
      return NextResponse.json(
        { error: "MESH verification failed. Invalid or expired Token." }, 
        { status: 401 }
      );
    }

    // 3. Extract the verified Pioneer credentials
    const pioneerVerificationData: PiUserResponse = await verifyResponse.json();

    // *Integration Node:* At this stage in the future v23 Mainnet, 
    // the Adjudicator would check `pioneerVerificationData.uid` against 
    // the DAO database to determine Service Provider access tiers.

    // 4. Return success signal to the client
    return NextResponse.json({ 
      status: "Verified", 
      username: pioneerVerificationData.username,
      uid: pioneerVerificationData.uid
    }, { status: 200 });

  } catch (error) {
    console.error("Bridge Connection Error:", error);
    return NextResponse.json(
      { error: "Bridge connection error. Adjudicator offline." }, 
      { status: 500 }
    );
  }
}