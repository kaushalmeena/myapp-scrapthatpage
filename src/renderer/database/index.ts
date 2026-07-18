import Dexie, { PromiseExtended, Table } from "dexie";
import { Script } from "../types/script";
import { mostPopularMoviesScript } from "./dummyScripts";

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
      this.scripts.add(mostPopularMoviesScript);
    });
  }

  fetchAllScripts = (): PromiseExtended<Script[]> =>
    this.scripts.reverse().toArray();

  fetchAllFavoriteScripts = (): PromiseExtended<Script[]> =>
    this.scripts.where("favorite").equals(1).reverse().toArray();

  fetchScriptById = (id: number): PromiseExtended<Script | undefined> =>
    this.scripts.get(id);

  createScript = (script: Script): PromiseExtended<number> =>
    this.scripts.add(script);

  updateScript = (script: Script): PromiseExtended<number> =>
    this.scripts.put(script);

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
