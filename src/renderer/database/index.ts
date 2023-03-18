import Dexie, { PromiseExtended, Table } from "dexie";
import { Script } from "../types/script";
import { topYoutubeVideosScript } from "./dummyScripts";

class ScriptDatabase extends Dexie {
  public scripts: Table<Script, number>;

  public constructor() {
    super("script_database");
    this.version(1).stores({ scripts: "++id, name, favorite" });
    this.scripts = this.table("scripts");
    this.on("populate", () => {
      this.scripts.add(topYoutubeVideosScript);
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

  updateScriptFavoriteField = (
    id: number,
    value: number
  ): PromiseExtended<number> => this.scripts.update(id, { favorite: value });
}

const db = new ScriptDatabase();

export default db;
