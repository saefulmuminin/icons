import { NextResponse } from "next/server";
import { EDITION_SHORT } from "@/lib/edition";

/** Answered fresh every time; a cached health check reports nothing useful. */
export const dynamic = "force-dynamic";

/**
 * Whether the server behind this site is up and answering.
 *
 * Kept to the shape the platform standard asks for, so one dashboard can read
 * every service the same way.
 */
export function GET() {
  return NextResponse.json({
    status: "success",
    message: "Connection is working properly!",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
    service: `${EDITION_SHORT} Website`,
  });
}
