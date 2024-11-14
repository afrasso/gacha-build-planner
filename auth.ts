import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (
          credentials?.username === getEnvVariable("TEST_CREDENTIALS_USERNAME") &&
          credentials?.password === getEnvVariable("TEST_CREDENTIALS_PASSWORD")
        ) {
          return { email: "test_credentials_user@test.com", id: "1", name: "Test Credentials User" };
        }
        return null;
      },
      credentials: {
        password: { label: "Password", type: "password" },
        username: { label: "Username", placeholder: "test@example.com", type: "text" },
      },
      name: "Credentials",
    }),
    GoogleProvider({
      clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVariable("GOOGLE_SECRET"),
    }),
  ],
};
