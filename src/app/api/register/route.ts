import { NextResponse } from "next/server";
import type { Registration } from "@/lib/registration";
import { validateRegistration } from "@/lib/registration";
import { simbaConfig, submitToSimba } from "@/lib/simba";

/**
 * The site has no SIMBA to file with.
 *
 * Told apart from a refusal on the way out: both leave the reader with the
 * same "try again", but they need opposite fixes, and whoever is looking into
 * it should not have to reach the server logs to find out which one this is.
 */
class NotConfigured extends Error {}

/** A registration is never a cached read, and it is never prerendered. */
export const dynamic = "force-dynamic";

/**
 * Bigger than any honest submission — the longest field is capped at 160
 * characters and there are fourteen of them — and small enough that a bad
 * actor cannot make the server read a megabyte before it says no.
 */
const MAX_BODY = 8 * 1024;

/**
 * Where an accepted registration goes: SIMBA, the committee's own event
 * register.
 *
 * With no configuration there is nowhere to put it. In development that is
 * ordinary — the endpoint is not something every contributor should be posting
 * to — so the entry goes to the log and the form is left working. In
 * production it is a misconfiguration, and saying "thank you" for a
 * registration that reached nobody is the one outcome worth refusing outright.
 */
async function store(entry: Registration) {
  const config = simbaConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      throw new NotConfigured(
        "no SIMBA credentials; refusing to drop the entry",
      );
    }

    console.info(
      "[register] not configured, logging only: %s",
      JSON.stringify({ ...entry, receivedAt: new Date().toISOString() }),
    );
    return;
  }

  await submitToSimba(entry, config);
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
    //
    // The whole entry goes to the log beside the reason. While the far side is
    // refusing — a bad id, an expired key, an outage — this is the only copy
    // that exists, and a registration recoverable from a log is worth more
    // than the tidiness of not writing one.
    console.error(
      "[register] REFUSED, entry kept here: %s | %s",
      cause instanceof Error ? cause.message : String(cause),
      JSON.stringify({ ...result.value, receivedAt: new Date().toISOString() }),
    );
    // A valve for the days the far side is down.
    //
    // Off unless REGISTRATION_ACCEPT_ON_REFUSAL is set, and deliberately so:
    // switching it on means telling a registrant they are on the list when the
    // only record is the line above. That is a promise the committee has to
    // keep by hand, out of the logs, and it is theirs to make rather than
    // mine. It beats the alternative while SIMBA is refusing — turning
    // everybody away registers nobody at all — but it is not a default.
    if (
      !(cause instanceof NotConfigured) &&
      process.env.REGISTRATION_ACCEPT_ON_REFUSAL === "1"
    ) {
      return NextResponse.json({ ok: true, filed: "log" });
    }

    return NextResponse.json(
      { error: cause instanceof NotConfigured ? "unconfigured" : "refused" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
