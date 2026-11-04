// Request handling for /api/pwa-events, kept free of next/server so it is unit-testable.
import { isPwaEvent } from "./telemetry.ts";

const MAX_BODY_BYTES = 1024;

export async function handlePwaEvent(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let event: unknown;
  try {
    event = (JSON.parse(raw) as { event?: unknown }).event;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isPwaEvent(event)) return new Response(null, { status: 400 });

  // One structured line per event. Count them in the host's log search.
  console.info(JSON.stringify({ type: "pwa_event", event, at: new Date().toISOString() }));
  return new Response(null, { status: 204 });
}
