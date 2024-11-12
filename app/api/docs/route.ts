import { NextResponse } from "next/server";
import path from "path";

import { __rootDirname } from "@/utils/directoryutils";
import { loadYaml } from "@/utils/yamlhelper";

export async function GET() {
  try {
    const openApiYaml = loadYaml(path.join(__rootDirname, "openapi.yaml"));
    return NextResponse.json(openApiYaml);
  } catch (error) {
    console.error("Error in /api/docs route:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ details: errorMessage, error: "Internal Server Error" }, { status: 500 });
  }
}
