import Dexie, { PromiseExtended } from "dexie";
import { Script } from "../types/script";

const DATABASE_NAME = "main_database";

class Database extends Dexie {
  public scripts: Dexie.Table<Script, number>;

  public constructor(name: string) {
    super(name);
    this.version(1).stores({ scripts: "++id,name" });
    this.scripts = this.table("scripts");
  }
}

export const db = new Database(DATABASE_NAME);

export const getAllScripts = (): PromiseExtended<Script[]> =>
  db.scripts.toArray();

export const createScript = (script: Script): PromiseExtended<number> =>
  db.scripts.add(script);
