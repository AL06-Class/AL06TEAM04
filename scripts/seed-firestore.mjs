import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tempSeedDir = resolve(rootDir, "scripts/.tmp/firestore-seed");
const compiledSeedEntryPath = resolve(tempSeedDir, "scripts/firestore-seed-entry.js");
const execFileAsync = promisify(execFile);

const collectionConfig = {
  assignments: {
    documentIdField: "assignmentId"
  },
  jobPostings: {
    documentIdField: "jobPostingId"
  }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const getValue = (name) => {
    const prefix = `${name}=`;
    const item = args.find((arg) => arg.startsWith(prefix));
    return item ? item.slice(prefix.length) : "";
  };

  return {
    dryRun: args.includes("--dry-run"),
    only: getValue("--only"),
    limit: Number(getValue("--limit")) || 0
  };
}

async function loadDotEnv() {
  const envPath = resolve(rootDir, ".env");

  try {
    const envText = await readFile(envPath, "utf8");
    envText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .forEach((line) => {
        const [key, ...valueParts] = line.split("=");
        if (!process.env[key]) {
          process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
        }
      });
  } catch {
    // .env is optional. Values may also be provided as shell environment variables.
  }
}

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return /^\d{4}-\d{2}-\d{2}T/.test(value) ? { timestampValue: value } : { stringValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value)
            .filter(([, itemValue]) => itemValue !== undefined)
            .map(([key, itemValue]) => [key, encodeFirestoreValue(itemValue)])
        )
      }
    };
  }
  return { stringValue: String(value) };
}

function encodeFirestoreFields(data) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, encodeFirestoreValue(value)])
  );
}

async function loadSeedData() {
  await mkdir(tempSeedDir, { recursive: true });
  await mkdir(resolve(tempSeedDir, "empty-types"), { recursive: true });
  await writeFile(resolve(tempSeedDir, "package.json"), JSON.stringify({ type: "commonjs" }), "utf8");
  await execFileAsync(process.execPath, [
    resolve(rootDir, "node_modules/typescript/lib/tsc.js"),
    resolve(rootDir, "scripts/firestore-seed-entry.ts"),
    "--target",
    "ES2020",
    "--module",
    "CommonJS",
    "--moduleResolution",
    "Node",
    "--rootDir",
    rootDir,
    "--outDir",
    tempSeedDir,
    "--typeRoots",
    resolve(tempSeedDir, "empty-types"),
    "--esModuleInterop",
    "--skipLibCheck"
  ]);

  const require = createRequire(import.meta.url);
  const seedModule = require(compiledSeedEntryPath);
  return seedModule.firestoreSeedData;
}

function getFirestoreBaseUrl() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!process.env.VITE_FIREBASE_API_KEY || !projectId) {
    throw new Error("Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID. Add them to .env first.");
  }
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

async function saveDocument(baseUrl, apiKey, collectionName, documentId, data) {
  const response = await fetch(`${baseUrl}/${collectionName}/${encodeURIComponent(documentId)}?key=${apiKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: encodeFirestoreFields(data)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${collectionName}/${documentId} upload failed: ${response.status} ${errorText}`);
  }
}

async function seedCollection({ baseUrl, apiKey, collectionName, items, documentIdField, dryRun, limit }) {
  const targetItems = limit > 0 ? items.slice(0, limit) : items;

  console.log(`${dryRun ? "[dry-run] " : ""}${collectionName}: ${targetItems.length} documents`);

  if (dryRun) return;

  for (const [index, item] of targetItems.entries()) {
    const documentId = item[documentIdField];
    if (!documentId) throw new Error(`${collectionName}[${index}] is missing ${documentIdField}`);
    await saveDocument(baseUrl, apiKey, collectionName, documentId, item);
    if ((index + 1) % 25 === 0 || index + 1 === targetItems.length) {
      console.log(`${collectionName}: uploaded ${index + 1}/${targetItems.length}`);
    }
  }
}

async function main() {
  const options = parseArgs();
  await loadDotEnv();

  const seedData = await loadSeedData();
  const baseUrl = options.dryRun ? "" : getFirestoreBaseUrl();
  const apiKey = options.dryRun ? "" : process.env.VITE_FIREBASE_API_KEY;
  const collections = options.only ? [options.only] : Object.keys(collectionConfig);

  for (const collectionName of collections) {
    const config = collectionConfig[collectionName];
    const items = seedData[collectionName];

    if (!config || !Array.isArray(items)) {
      throw new Error(`Unknown seed collection: ${collectionName}`);
    }

    await seedCollection({
      baseUrl,
      apiKey,
      collectionName,
      items,
      documentIdField: config.documentIdField,
      dryRun: options.dryRun,
      limit: options.limit
    });
  }

  await rm(tempSeedDir, { recursive: true, force: true });
  console.log("Firestore seed completed.");
}

main().catch(async (error) => {
  await rm(tempSeedDir, { recursive: true, force: true });
  console.error(error.message);
  process.exit(1);
});
