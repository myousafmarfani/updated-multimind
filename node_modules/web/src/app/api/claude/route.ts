import { proxyModelPost } from "@/app/api/_shared/proxy";

export async function POST(request: Request) {
  return proxyModelPost("claude", request);
}
