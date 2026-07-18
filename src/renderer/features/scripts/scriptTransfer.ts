import { scriptSchema, SCRIPT_SCHEMA_VERSION } from "@/database/schema";
import { Script } from "@/types/script";

// Marker written into exported files so imports can recognize them.
const FILE_KIND = "scrap-that-page/script";

type ScriptExportFile = {
  kind: string;
  version: number;
  script: Script;
};

// Anchor-click download, mirroring saveFile in runner/runnerUtils.ts (kept
// local so the scripts feature doesn't depend on runner code).
const saveJSONFile = (data: string, filename: string) => {
  const blob = new Blob([data], { type: "application/json" });
  const href = window.URL.createObjectURL(blob);
  const anchorEl = document.createElement("a");
  anchorEl.download = filename;
  anchorEl.href = href;
  anchorEl.click();
  window.URL.revokeObjectURL(href);
};

export const exportScriptToJSON = (script: Script): void => {
  const file: ScriptExportFile = {
    kind: FILE_KIND,
    version: SCRIPT_SCHEMA_VERSION,
    script: { ...script, id: undefined }
  };
  saveJSONFile(
    JSON.stringify(file, null, 2),
    `${script.name || "script"}.json`
  );
};

// Parses an imported JSON file into a Script. Accepts both a bare script
// object and the { kind, version, script } envelope written by
// exportScriptToJSON. Throws a descriptive Error on any failure.
export const parseScriptImport = (jsonText: string): Script => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("The file is not valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("The file does not contain a script object.");
  }

  // Unwrap the export envelope when present.
  const candidate =
    "script" in parsed ? (parsed as { script: unknown }).script : parsed;

  if (typeof candidate !== "object" || candidate === null) {
    throw new Error("The file does not contain a script object.");
  }

  const result = scriptSchema.safeParse({
    ...(candidate as Record<string, unknown>),
    id: undefined,
    version: undefined
  });
  if (!result.success) {
    throw new Error(`The file is not a valid script: ${result.error.message}`);
  }
  return result.data;
};
