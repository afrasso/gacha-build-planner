import { NextResponse } from "next/server";

import * as API from "@/app/api/types";
import { getServerSession } from "@/lib/sessionhelper";
import { createUser, getUserByEmail } from "@/repositories/userRepository";
import { getBaseUrl } from "@/utils/urlhelper";

export async function GET(request: Request) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const apiUsers: API.User[] = [];

  if (sessionEmail && (email === sessionEmail || !email)) {
    const user = await getUserByEmail({ email: sessionEmail });
    if (user) {
      apiUsers.push({
        _links: { self: { href: `${getBaseUrl()}/api/users/${user.id}`, id: user.id } },
        email: user.email,
        id: user.id,
      });
    }
  }

  const response = {
    _embedded: {
      users: apiUsers,
    },
    _links: {
      self: {
        href: `${getBaseUrl()}/api/users`,
      },
    },
  };

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const { email } = await request.json();
  if (!email || email !== sessionEmail) {
    return NextResponse.json(
      { message: "You are not allowed to create a user with an email other than your own." },
      { status: 403 }
    );
  }

  if (await getUserByEmail({ email })) {
    return NextResponse.json({ message: "A user for that email address already exists." }, { status: 400 });
  }

  const user = await createUser({ email });
  const apiUser: API.User = {
    _links: { self: { href: `${getBaseUrl()}/api/users/${user.id}`, id: user.id } },
    email,
    id: user.id,
  };

  return NextResponse.json(apiUser, { status: 201 });
}
