import getEnvVariable from "@/utils/getenvvariable";

import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return <AuthCallbackClient apiUrl={getEnvVariable("API_URL")} />;
}
