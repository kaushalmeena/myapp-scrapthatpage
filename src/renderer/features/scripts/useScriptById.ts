import { useLiveQuery } from "dexie-react-hooks";
import db from "@/database";

// Live-queries a single script. Distinguishes "still loading" (undefined)
// from "not found" (null) so screens can show the right state; updates
// automatically whenever the record changes in IndexedDB.
export const useScriptById = (id: number) =>
  useLiveQuery(async () => (await db.fetchScriptById(id)) ?? null, [id]);
