import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, DATABASE_URL: "file:./test.db" };
const prismaCli = resolve(root, "node_modules/prisma/build/index.js");
const vitestCli = resolve(root, "node_modules/vitest/vitest.mjs");
const testDatabase = new DatabaseSync(resolve(root, "prisma/test.db"));
testDatabase.close();

for (const [label, entry, args] of [
  ["Preparando o banco isolado dos testes", prismaCli, ["db", "push", "--skip-generate"]],
  ["Executando os testes", vitestCli, ["run"]],
]) {
  console.log(`\n${label}…`);
  const result = spawnSync(process.execPath, [entry, ...args], { cwd: root, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
