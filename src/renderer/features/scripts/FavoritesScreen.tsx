import AsyncContent from "@/components/AsyncContent";
import PageHeader from "@/components/PageHeader";
import db from "@/database";
import { useDexieFetch } from "@/hooks/useDexieFetch";
import { Script } from "@/types/script";
import ScriptList from "./ScriptList";

function FavoritesScreen() {
  const {
    result: scripts,
    status,
    error,
    reload
  } = useDexieFetch<Script[]>({
    fetcher: () => db.fetchAllFavoriteScripts(),
    defaultValue: []
  });

  return (
    <>
      <PageHeader title="Favorites" />
      <AsyncContent status={status} error={error}>
        <ScriptList scripts={scripts} onReload={reload} />
      </AsyncContent>
    </>
  );
}

export default FavoritesScreen;
