import { NextResponse } from "next/server";

import * as API from "@/app/api/types";
import { getServerSession } from "@/lib/sessionhelper";
import { getUserById } from "@/repositories/userRepository";
import { getBaseUrl } from "@/utils/urlhelper";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const userId = params.userId;

  const user = await getUserById({ id: userId });
  if (!user || user.email !== sessionEmail) {
    return NextResponse.json({ error: "This action is forbidden." }, { status: 403 });
  }

  const apiUser: API.User = {
    _links: { self: { href: `${getBaseUrl()}/users/${user.id}`, id: user.id } },
    email: user.email,
    id: user.id,
  };

  return NextResponse.json(apiUser, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const userId = params.userId;

  const user = await getUserById({ id: userId });
  if (!user || user.email !== sessionEmail) {
    return NextResponse.json(
      { error: "You are not allowed to update a user with an email other than your own." },
      { status: 403 }
    );
  }

  const { email } = await request.json();
  if (email !== user.email) {
    return NextResponse.json({ error: "User emails cannot be changed." }, { status: 400 });
  }

  const apiUser: API.User = {
    _links: { self: { href: `${getBaseUrl()}/users/${user.id}`, id: user.id } },
    email: user.email,
    id: user.id,
  };

  return NextResponse.json(apiUser, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ error: "This function is not yet implemented." }, { status: 501 });
}
