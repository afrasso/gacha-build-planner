import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

import { Plan } from "@/types";

export async function createPlanForUser({ plan, userId }: { plan: Plan; userId: string }): Promise<Plan> {
  try {
    const id = uuidv4();
    await sql`
      INSERT INTO plans (id, user_id, plan_data)
      VALUES (${id}, ${userId}, ${JSON.stringify({ builds: plan.builds })})
    `;
    return { builds: plan.builds, id, userId };
  } catch (error) {
    console.error("Error in createPlanForUser:", error);
    throw error;
  }
}

export async function getPlanById({ id }: { id: string }): Promise<Plan | undefined> {
  try {
    const result = await sql`
      SELECT id, user_id, plan_data
      FROM plans
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!result.rows[0]) {
      return;
    }
    return {
      builds: result.rows[0].plan_data.builds,
      id: result.rows[0].id,
      userId: result.rows[0].userId,
    };
  } catch (error) {
    console.error("Error in getPlanById:", error);
    throw error;
  }
}

export async function getPlansByUserId({ userId }: { userId: string }): Promise<Plan[]> {
  try {
    const result = await sql`
      SELECT id, user_id, plan_data
      FROM plans
      WHERE user_id = ${userId}
    `;
    return result.rows.map((row) => ({
      builds: row.plan_data.builds,
      id: row.id,
      userId: row.userId,
    }));
  } catch (error) {
    console.error("Error in getPlansByUserId:", error);
    throw error;
  }
}

export async function updatePlan({ id, plan }: { id: string; plan: Plan }): Promise<void> {
  try {
    await sql`
      UPDATE plans
      SET (plan_data) VALUES (${JSON.stringify({ builds: plan.builds })})
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error in updatePlan:", error);
    throw error;
  }
}
