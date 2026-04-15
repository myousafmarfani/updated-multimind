import { proxyModelHealth } from "@/app/api/_shared/proxy";

export async function GET() {
  return proxyModelHealth("grok");
}
