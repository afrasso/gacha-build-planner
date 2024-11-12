import { NextResponse } from "next/server";

import * as API from "@/app/api/types";
import { getServerSession } from "@/lib/sessionhelper";
import { getPlanById, updatePlan } from "@/repositories/planRepository";
import { getUserById } from "@/repositories/userRepository";
import { getBaseUrl } from "@/utils/urlhelper";

export async function GET(request: Request, { params }: { params: { planId: string; userId: string } }) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const { planId, userId } = params;

  const user = await getUserById({ id: userId });
  if (!user || user.email !== sessionEmail) {
    return NextResponse.json({ error: "This action is forbidden." }, { status: 403 });
  }

  const plan = await getPlanById({ id: planId });
  if (!plan || plan.userId !== userId) {
    return NextResponse.json({ error: "This action is forbidden." }, { status: 403 });
  }

  const apiPlan: API.Plan = {
    _links: {
      self: { href: `${getBaseUrl()}/users/${userId}/plans/${plan.id}` },
      user: { href: `${getBaseUrl()}/users/${userId}` },
    },
    builds: plan.builds,
    id: plan.id,
  };

  return NextResponse.json(apiPlan, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { planId: string; userId: string } }) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const { planId, userId } = params;

  const user = await getUserById({ id: userId });
  if (!user || user.email !== sessionEmail) {
    return NextResponse.json({ error: "This action is forbidden." }, { status: 403 });
  }

  const planRequest = await request.json();
  await updatePlan({ id: planId, plan: planRequest });

  const apiPlan: API.Plan = {
    _links: {
      self: { href: `${getBaseUrl()}/users/${userId}/plans/${planId}` },
      user: { href: `${getBaseUrl()}/users/${userId}` },
    },
    builds: planRequest.builds,
    id: planId,
  };

  return NextResponse.json(apiPlan, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ error: "This function is not yet implemented." }, { status: 501 });
}
