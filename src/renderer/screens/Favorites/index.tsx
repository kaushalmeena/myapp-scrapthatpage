import AsyncContent from "../../components/AsyncContent";
import PageName from "../../components/PageName";
import ScriptList from "../../components/ScriptList";
import db from "../../database";
import { useDexieFetch } from "../../hooks/useDexieFetch";
import { Script } from "../../types/script";

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
      <PageName name="Favorites" />
      <AsyncContent status={status} error={error}>
        <ScriptList scripts={scripts} onReload={reload} />
      </AsyncContent>
    </>
  );
}

export default FavoritesScreen;
