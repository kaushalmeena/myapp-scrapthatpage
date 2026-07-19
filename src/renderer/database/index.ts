import Dexie, { type PromiseExtended, type Table } from "dexie";
import type { Run } from "../types/run";
import type { Script } from "../types/script";
import { parseStoredScript, prepareScriptForWrite } from "./schema";
import { mostPopularMoviesScript } from "./seedScripts";

// Every script passes through the zod schema at this boundary: writes are
// validated (and version-stamped) so corrupt data never lands in IndexedDB,
// and reads are validated so hand-edited records can't crash the UI.
class AppDatabase extends Dexie {
  public scripts: Table<Script, number>;

  public runs: Table<Run, number>;

  public constructor() {
    super("scrap-that-page");
    // `favorite` is a boolean and deliberately unindexed: IndexedDB cannot
    // index boolean values, so favorites are found by filtering instead
    // (fine at personal-library scale).
    this.version(1).stores({
      scripts: "++id, name",
      runs: "++id, scriptId, startedAt"
    });
    this.scripts = this.table("scripts");
    this.runs = this.table("runs");
    // Seed a sample script the first time the database is created.
    this.on("populate", () => {
      this.scripts.add(prepareScriptForWrite(mostPopularMoviesScript));
    });
  }

  getScripts = (): Promise<Script[]> =>
    this.scripts
      .reverse()
      .toArray()
      .then((records) => records.map(parseStoredScript).filter((s) => !!s));

  getFavoriteScripts = (): Promise<Script[]> =>
    this.scripts
      .filter((record) => record.favorite === true)
      .reverse()
      .toArray()
      .then((records) => records.map(parseStoredScript).filter((s) => !!s));

  getScriptById = (id: number): Promise<Script | undefined> =>
    this.scripts.get(id).then((record) => {
      if (record === undefined) {
        return undefined;
      }
      return parseStoredScript(record) ?? undefined;
    });

  createScript = (script: Script): PromiseExtended<number> =>
    this.scripts.add(prepareScriptForWrite(script));

  updateScript = (script: Script): PromiseExtended<number> =>
    this.scripts.put(prepareScriptForWrite(script));

  deleteScript = (id: number): PromiseExtended<void> => this.scripts.delete(id);

  // Uses get + put instead of Dexie's `update`, whose `UpdateSpec` deep-maps
  // the recursive DataOperation union and fails to type-check.
  setScriptFavorite = async (id: number, value: boolean): Promise<void> => {
    const script = await this.scripts.get(id);
    if (script) {
      await this.scripts.put({ ...script, favorite: value });
    }
  };

  // Runs are app-generated at the end of an execution, so they skip the zod
  // validation that user-editable scripts go through.
  createRun = (run: Run): PromiseExtended<number> => this.runs.add(run);

  getRecentRuns = (limit = 50): Promise<Run[]> =>
    this.runs.orderBy("startedAt").reverse().limit(limit).toArray();

  getRunById = (id: number): PromiseExtended<Run | undefined> =>
    this.runs.get(id);

  deleteRun = (id: number): PromiseExtended<void> => this.runs.delete(id);

  clearRuns = (): PromiseExtended<void> => this.runs.clear();
}

const db = new AppDatabase();

export default db;
