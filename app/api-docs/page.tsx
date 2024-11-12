"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import AuthButton from "@/components/AuthButton";

import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch API docs");
        }
        return response.json();
      })
      .then((data) => setSpec(data))
      .catch((err) => {
        console.error("Error fetching API docs:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error loading API docs: {error}</div>;
  }

  return spec ? (
    <>
      <AuthButton />
      <SwaggerUI spec={spec} />
    </>
  ) : (
    <div>Loading API docs...</div>
  );
}
