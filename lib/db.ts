import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

import { Plan } from "@/types";

console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

async function createUser({ email }: { email: string }): Promise<string> {
  const id = uuidv4();
  await sql`
    INSERT INTO users (id, email)
    VALUES (${id}, ${email})
  `;
  return id;
}

async function getUserId({ email }: { email: string }): Promise<string | undefined> {
  const result = await sql`
    SELECT id
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  return result.rows[0]?.id;
}

async function createPlan({ plan, userId }: { plan: Plan; userId: string }) {
  const id = uuidv4();
  await sql`
    INSERT INTO plans (id, user_id, plan_data)
    VALUES (${id}, ${userId}, ${JSON.stringify(plan)})
  `;
}

async function getPlanId({ userId }: { userId: string }): Promise<string | undefined> {
  const result = await sql`
    SELECT id
    FROM plans
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  return result.rows[0]?.id;
}

async function updatePlan({ id, plan }: { id: string; plan: Plan }) {
  await sql`
    UPDATE plans
    SET plan_data = ${JSON.stringify(plan)}
    WHERE id = ${id}
  `;
}

export async function savePlan({ email, plan }: { email: string; plan: Plan }) {
  const userId = (await getUserId({ email })) ?? (await createUser({ email }));
  const id = await getPlanId({ userId });
  return id ? updatePlan({ id, plan }) : createPlan({ plan, userId });
}

export async function getPlan({ email }: { email: string }): Promise<Plan | undefined> {
  const userId = await getUserId({ email });
  if (!userId) {
    return;
  }
  const result = await sql`
    SELECT plan_data
    FROM plans
    WHERE user_id = ${userId}
  `;
  return result.rows[0]?.plan_data;
}
