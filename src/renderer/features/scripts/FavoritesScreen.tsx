import { useLiveQuery } from "dexie-react-hooks";
import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import ScriptList from "./ScriptList";

function FavoritesScreen() {
  const scripts = useLiveQuery(() => db.fetchAllFavoriteScripts(), []);

  return (
    <>
      <PageHeader title="Favorites" />
      <AsyncContent
        status={scripts === undefined ? "loading" : "loaded"}
        error=""
      >
        <ScriptList scripts={scripts ?? []} />
      </AsyncContent>
    </>
  );
}

export default FavoritesScreen;
