import { spawn } from "node:child_process";

const processes = [
  { name: "web", command: "npm", args: ["--prefix", "apps/web", "run", "dev"], color: "\x1b[36m" },
  {
    name: "gemini",
    command: "python",
    args: [
      "-m",
      "uvicorn",
      "main:app",
      "--reload",
      "--reload-dir",
      "services/gemini-service",
      "--port",
      "8001",
      "--app-dir",
      "services/gemini-service",
    ],
    color: "\x1b[32m",
  },
  {
    name: "chatgpt",
    command: "python",
    args: [
      "-m",
      "uvicorn",
      "main:app",
      "--reload",
      "--reload-dir",
      "services/chatgpt-service",
      "--port",
      "8002",
      "--app-dir",
      "services/chatgpt-service",
    ],
    color: "\x1b[33m",
  },
  {
    name: "claude",
    command: "python",
    args: [
      "-m",
      "uvicorn",
      "main:app",
      "--reload",
      "--reload-dir",
      "services/claude-service",
      "--port",
      "8003",
      "--app-dir",
      "services/claude-service",
    ],
    color: "\x1b[35m",
  },
  {
    name: "grok",
    command: "python",
    args: [
      "-m",
      "uvicorn",
      "main:app",
      "--reload",
      "--reload-dir",
      "services/grok-service",
      "--port",
      "8004",
      "--app-dir",
      "services/grok-service",
    ],
    color: "\x1b[34m",
  },
];

const resetColor = "\x1b[0m";
const children = [];

function prefixLines(name, color, chunk) {
  const text = chunk.toString();
  text
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((line) => {
      process.stdout.write(`${color}[${name}]${resetColor} ${line}\n`);
    });
}

for (const proc of processes) {
  const child = spawn(proc.command, proc.args, {
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  child.stdout.on("data", (chunk) => prefixLines(proc.name, proc.color, chunk));
  child.stderr.on("data", (chunk) => prefixLines(proc.name, proc.color, chunk));

  child.on("exit", (code) => {
    process.stdout.write(`${proc.color}[${proc.name}] exited with code ${code}${resetColor}\n`);
    if (code !== 0 && code !== null) {
      shutdown();
    }
  });

  children.push(child);
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
}

process.on("SIGINT", () => {
  process.stdout.write("\nStopping all services...\n");
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
