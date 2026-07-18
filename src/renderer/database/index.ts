import Dexie, { PromiseExtended, Table } from "dexie";
import { Script } from "../types/script";
import { mostPopularMoviesScript } from "./dummyScripts";
import { parseStoredScript, prepareScriptForWrite } from "./schema";

// Every script passes through the zod schema at this boundary: writes are
// validated (and version-stamped) so corrupt data never lands in IndexedDB,
// and reads are validated (and migrated) so old or hand-edited records can't
// crash the UI.
class ScriptDatabase extends Dexie {
  public scripts: Table<Script, number>;

  public constructor() {
    super("script_database");
    // `favorite` is indexed as a number (0/1) rather than a boolean because
    // IndexedDB cannot index boolean values.
    this.version(1).stores({ scripts: "++id, name, favorite" });
    this.scripts = this.table("scripts");
    // Seed a sample script the first time the database is created.
    this.on("populate", () => {
      this.scripts.add(prepareScriptForWrite(mostPopularMoviesScript));
    });
  }

  fetchAllScripts = (): Promise<Script[]> =>
    this.scripts
      .reverse()
      .toArray()
      .then((records) => records.map(parseStoredScript).filter((s) => !!s));

  fetchAllFavoriteScripts = (): Promise<Script[]> =>
    this.scripts
      .where("favorite")
      .equals(1)
      .reverse()
      .toArray()
      .then((records) => records.map(parseStoredScript).filter((s) => !!s));

  fetchScriptById = (id: number): Promise<Script | undefined> =>
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

  deleteScriptById = (id: number): PromiseExtended<void> =>
    this.scripts.delete(id);

  // Uses get + put instead of Dexie's `update`, whose `UpdateSpec` deep-maps
  // the recursive SmallOperation union and fails to type-check.
  updateScriptFavoriteField = async (
    id: number,
    value: number
  ): Promise<void> => {
    const script = await this.scripts.get(id);
    if (script) {
      await this.scripts.put({ ...script, favorite: value });
    }
  };
}

const db = new ScriptDatabase();

export default db;
