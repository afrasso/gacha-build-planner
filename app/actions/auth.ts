"use server";

import { redirect } from "next/navigation";

import getEnvVariable from "@/utils/getenvvariable";

export async function initiateDiscordOauthSignIn() {
  return redirect(`${getEnvVariable("API_URL")}/auth/discord/`);
}

export async function initiateFacebookOauthSignIn() {
  return redirect(`${getEnvVariable("API_URL")}/auth/facebook/`);
}

export async function initiateGoogleOauthSignIn() {
  return redirect(`${getEnvVariable("API_URL")}/auth/google/`);
}
