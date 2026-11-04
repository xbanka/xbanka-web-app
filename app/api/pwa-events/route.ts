import { handlePwaEvent } from "@/lib/pwa/events-route";

export async function POST(request: Request) {
  return handlePwaEvent(request);
}
