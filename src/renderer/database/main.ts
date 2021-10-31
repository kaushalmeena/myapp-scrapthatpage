import Dexie, { PromiseExtended } from "dexie";
import { Script } from "../types/script";

const DATABASE_NAME = "main_database";

class Database extends Dexie {
  public scripts: Dexie.Table<Script, number>;

  public constructor(name: string) {
    super(name);
    this.version(1).stores({ scripts: "++id, name, favourite" });
    this.scripts = this.table("scripts");
  }
}

export const db = new Database(DATABASE_NAME);

export const fetchAllScripts = (): PromiseExtended<Script[]> =>
  db.scripts.toArray();

export const fetchAllFavoriteScripts = (): PromiseExtended<Script[]> =>
  db.scripts.where("favourite").equals(1).toArray();

export const fetchScript = (id: number): PromiseExtended<Script | undefined> =>
  db.scripts.get(id);

export const createScript = (script: Script): PromiseExtended<number> =>
  db.scripts.add(script);

export const updateScript = (script: Script): PromiseExtended<number> =>
  db.scripts.put(script);

export const deleteScript = (id: number): PromiseExtended<void> =>
  db.scripts.delete(id);
