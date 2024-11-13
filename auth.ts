import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVariable("GOOGLE_SECRET"),
    }),
  ],
};
