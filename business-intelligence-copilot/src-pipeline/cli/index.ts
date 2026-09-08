import { initDb } from "../../server/db";
import { runSeedPipeline } from "../../server/services/pipeline";

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];
    if (current?.startsWith("--") && next) {
      args.set(current, next);
      index += 1;
    }
  }

  return args;
}

async function main() {
  const command = process.argv[2];
  const args = parseArgs(process.argv.slice(3));

  if (command !== "run-pipeline") {
    console.log('Usage: npm run pipeline -- run-pipeline --query "dentist in Austin" --limit 12');
    process.exitCode = 1;
    return;
  }

  const query = args.get("--query") ?? "dentist in Austin";
  const limit = Number(args.get("--limit") ?? 12);

  initDb();
  const run = await runSeedPipeline(query, limit);
  console.log(`Created run #${run.id} for "${run.query}" with ${run.businessCount} businesses.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
