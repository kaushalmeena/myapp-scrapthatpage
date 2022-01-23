import Dexie, { PromiseExtended } from "dexie";
import { Script } from "../types/script";

class ScriptDatabase extends Dexie {
  public scripts: Dexie.Table<Script, number>;

  public constructor() {
    super("script_database");
    this.version(1).stores({ scripts: "++id, name, favorite" });
    this.scripts = this.table("scripts");
  }
}

export const db = new ScriptDatabase();

export const fetchAllScripts = (): PromiseExtended<Script[]> =>
  db.scripts.reverse().toArray();

export const fetchAllFavoriteScripts = (): PromiseExtended<Script[]> =>
  db.scripts.where("favorite").equals(1).reverse().toArray();

export const fetchScript = (id: number): PromiseExtended<Script | undefined> =>
  db.scripts.get(id);

export const createScript = (script: Script): PromiseExtended<number> =>
  db.scripts.add(script);

export const updateScript = (script: Script): PromiseExtended<number> =>
  db.scripts.put(script);

export const deleteScript = (id: number): PromiseExtended<void> =>
  db.scripts.delete(id);

export const updateFavoriteScriptField = (
  id: number,
  value: number
): PromiseExtended<number> => db.scripts.update(id, { favorite: value });
