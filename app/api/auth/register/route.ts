import { handleRegister } from 'lyzr-architect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = await handleRegister(req);

  // Extract token from Set-Cookie header and include in response body
  const setCookie = response.headers.get('set-cookie') || '';
  const tokenMatch = setCookie.match(/auth_token=([^;]+)/);

  if (tokenMatch) {
    const originalBody = await response.json();
    const newBody = { ...originalBody, token: tokenMatch[1] };
    const newResponse = NextResponse.json(newBody, { status: response.status });

    // Copy cookies from original response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        newResponse.headers.append('set-cookie', value);
      }
    });

    return newResponse;
  }

  return response;
}
