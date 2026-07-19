import { useLiveQuery } from "dexie-react-hooks";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import ScriptList from "./ScriptList";

export default function FavoritesScreen() {
  const scripts = useLiveQuery(() => db.getFavoriteScripts(), []);

  return (
    <>
      <PageHeader title="Favorites" subtitle="Scripts you marked as favorite" />
      <AsyncContent status={scripts === undefined ? "loading" : "loaded"}>
        <ScriptList scripts={scripts ?? []} />
      </AsyncContent>
    </>
  );
}
