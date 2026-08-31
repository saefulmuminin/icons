import { NextResponse } from "next/server";
import type { Registration } from "@/lib/registration";
import { validateRegistration } from "@/lib/registration";

/** A registration is never a cached read, and it is never prerendered. */
export const dynamic = "force-dynamic";

/**
 * Bigger than any honest submission — the longest field is capped at 160
 * characters and there are fourteen of them — and small enough that a bad
 * actor cannot make the server read a megabyte before it says no.
 */
const MAX_BODY = 8 * 1024;

/**
 * Where an accepted registration goes.
 *
 * Nothing is stored yet: the committee has not settled on where the register
 * should live, so this writes the submission to the server log and reports
 * success. The form, its validation and the wire format are finished and do
 * not change when that decision lands — only the body of this function does,
 * to a spreadsheet append, a mail, or an insert.
 */
async function store(entry: Registration) {
  console.info(
    "[register] %s",
    JSON.stringify({ ...entry, receivedAt: new Date().toISOString() }),
  );
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY) {
    return NextResponse.json({ error: "too-large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  // A field no person can see and no browser fills in. Anything that arrives
  // with it filled is a script working through the page, and is answered with
  // the same success a registrant gets so it learns nothing.
  if (typeof body === "object" && body !== null && "website" in body) {
    const trap = (body as { website?: unknown }).website;
    if (typeof trap === "string" && trap.trim()) {
      return NextResponse.json({ ok: true });
    }
  }

  const result = validateRegistration(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "invalid", fields: result.errors },
      { status: 400 },
    );
  }

  try {
    await store(result.value);
  } catch (cause) {
    // The reader is told to try again rather than being handed a success the
    // committee has no record of.
    console.error("[register] could not be stored", cause);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
