import { getServerSession as getNextAuthServerSession } from "next-auth/next";

import { authOptions } from "@/auth";

export async function getServerSession() {
  return await getNextAuthServerSession(authOptions);
}
