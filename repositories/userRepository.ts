import { sql } from "@vercel/postgres";
import { v4 as uuidv4, validate } from "uuid";

import { User } from "@/types";

export async function createUser({ email }: { email: string }): Promise<User> {
  try {
    const id = uuidv4();
    await sql`
      INSERT INTO users (id, email)
      VALUES (${id}, ${email})
    `;
    return { email, id };
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}

export async function getUserByEmail({ email }: { email: string }): Promise<undefined | User> {
  try {
    const result = await sql`
      SELECT id, email
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    if (!result.rows[0]) {
      return;
    }
    return {
      email: result.rows[0].email,
      id: result.rows[0].id,
    };
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
}

export async function getUserById({ id }: { id: string }): Promise<undefined | User> {
  if (!validate(id)) {
    return;
  }
  try {
    const result = await sql`
      SELECT id, email
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!result.rows[0]) {
      return;
    }
    return {
      email: result.rows[0].email,
      id: result.rows[0].id,
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
}
