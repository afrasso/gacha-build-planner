import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Please authenticate before performing this action." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/users/:path*",
};
