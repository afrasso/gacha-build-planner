"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import getEnvVariable from "@/utils/getenvvariable";

// export async function validateToken(token: string) {
//   if (!token) {
//     return { success: false, user: null };
//   }

//   try {
//     const response = await fetch(`${getEnvVariable("API_URL")}/auth/tokens/validate`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//     });

//     if (response.ok) {
//       const userData = await response.json();
//       return { success: true, user: userData };
//     } else {
//       return { success: false, user: null };
//     }
//   } catch (error) {
//     console.error("Error validating token:", error);
//     return { success: false, user: null };
//   }
// }

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/tokens`, {
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.ok) {
      const { token } = await response.json();

      cookies().set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return { success: true, user: { email } };
    }
    return { success: false };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false };
  }
}

export async function logout() {
  cookies().delete("token");
}

export async function getToken() {
  const token = cookies().get("token")?.value;
  return token;
}

export async function initiateDiscordOauthSignIn() {
  return redirect(`${getEnvVariable("API_URL")}/auth/discord/`);
}

export async function initiateFacebookOauthSignIn() {
  return redirect(`${getEnvVariable("API_URL")}/auth/facebook/`);
}

export async function initiateGoogleOauthSignIn() {
  const response = await redirect(`${getEnvVariable("API_URL")}/auth/google/`);
  console.log(JSON.stringify(response));
  return response;
}
