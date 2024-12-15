import { Suspense } from "react";

import getEnvVariable from "@/utils/getenvvariable";

import AuthCallbackClient from "../../AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackClient callbackUrl={`${getEnvVariable("API_URL")}/auth/facebook/tokens`} />
    </Suspense>
  );
}
