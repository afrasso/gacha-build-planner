import { Suspense } from "react";

import getEnvVariable from "@/utils/getenvvariable";

import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  <Suspense fallback={<div>Loading...</div>}>
    return <AuthCallbackClient apiUrl={getEnvVariable("API_URL")} />;
  </Suspense>;
}
