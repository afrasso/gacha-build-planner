import { NextResponse } from "next/server";

import * as API from "@/app/api/types";
import { getServerSession } from "@/lib/sessionhelper";
import { createPlanForUser, getPlansByUserId } from "@/repositories/planRepository";
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

  const plans = await getPlansByUserId({ userId });
  const apiPlans: API.Plan[] = plans.map((plan) => ({
    _links: {
      self: { href: `${getBaseUrl()}/api/users/${userId}/plans/${plan.id}`, id: plan.id },
      user: { href: `${getBaseUrl()}/api/users/${userId}`, id: userId },
    },
    builds: plan.builds,
    id: plan.id,
  }));

  const response = {
    _embedded: {
      plans: apiPlans,
    },
    _links: {
      self: {
        href: `${getBaseUrl()}/api/users/${userId}/plans`,
      },
    },
  };

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession();
  const sessionEmail = session?.user?.email;

  const userId = params.userId;

  const user = await getUserById({ id: userId });
  if (!user || user.email !== sessionEmail) {
    return NextResponse.json({ error: "This action is forbidden." }, { status: 403 });
  }

  const plans = await getPlansByUserId({ userId });
  if (plans && plans.length > 0) {
    return NextResponse.json(
      { message: "A plan for that user already exists. At this time, no more than one plan is supported." },
      { status: 400 }
    );
  }

  const planRequest = await request.json();
  const plan = await createPlanForUser({ plan: planRequest, userId });
  const apiPlan: API.Plan = {
    _links: {
      self: { href: `${getBaseUrl()}/api/users/${userId}/plans/${plan.id}`, id: plan.id },
      user: { href: `${getBaseUrl()}/api/users/${userId}`, id: userId },
    },
    builds: plan.builds,
    id: plan.id,
  };

  return NextResponse.json(apiPlan, { status: 201 });
}
