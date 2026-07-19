import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  CheckCircle2,
  CircleOff,
  History,
  Library,
  Pencil,
  Play,
  SquarePlus,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import db from "@/database";
import type { Run } from "@/types/run";

function RunStatusIcon({ status }: { status: Run["status"] }) {
  switch (status) {
    case "finished":
      return <CheckCircle2 className="size-4 shrink-0 text-success" />;
    case "error":
      return <XCircle className="size-4 shrink-0 text-destructive" />;
    default:
      return <CircleOff className="size-4 shrink-0 text-muted-foreground" />;
  }
}

function SectionCard({
  title,
  viewAllRoute,
  children
}: {
  title: string;
  viewAllRoute: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const handleViewAll = () => navigate(viewAllRoute);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-7 gap-1 text-xs text-muted-foreground"
          onClick={handleViewAll}
        >
          View all
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-col p-1.5">{children}</div>
    </Card>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.scraper.getVersion().then((version) => setVersion(`v${version}`));
  }, []);

  const scripts = useLiveQuery(() => db.getScripts(), []);
  const runs = useLiveQuery(() => db.getRecentRuns(5), []);

  const recentScripts = scripts?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader
        title="Home"
        subtitle={`Point-and-click web scraping${version ? ` · ${version}` : ""}`}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            title: "New script",
            subtitle: "Start from scratch",
            Icon: SquarePlus,
            route: "/create"
          },
          {
            title: "Browse scripts",
            subtitle: "Run, edit or export",
            Icon: Library,
            route: "/search"
          },
          {
            title: "View history",
            subtitle: "Past run results",
            Icon: History,
            route: "/history"
          }
        ].map(({ title, subtitle, Icon, route }) => (
          <Card key={route} className="p-0">
            <button
              type="button"
              className="flex h-full w-full cursor-pointer items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-accent"
              onClick={() => navigate(route)}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </button>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Recent scripts" viewAllRoute="/search">
          {recentScripts.length === 0 ? (
            <EmptyHint message="No scripts yet — create your first one to get started." />
          ) : (
            recentScripts.map((script) => (
              <div
                key={script.id}
                className="group flex items-center gap-1 rounded-md"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 cursor-pointer rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent"
                  title="Run script"
                  onClick={() => navigate(`/execute/${script.id}`)}
                >
                  <p className="truncate text-sm font-medium">{script.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {script.operations.length}{" "}
                    {script.operations.length === 1 ? "step" : "steps"}
                  </p>
                </button>
                <div className="flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    title="Run script"
                    onClick={() => navigate(`/execute/${script.id}`)}
                  >
                    <Play className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    title="Edit script"
                    onClick={() => navigate(`/update/${script.id}`)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Recent runs" viewAllRoute="/history">
          {!runs || runs.length === 0 ? (
            <EmptyHint message="No runs yet — results will appear here after you run a script." />
          ) : (
            runs.map((run) => (
              <button
                key={run.id}
                type="button"
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent"
                title="Open run details"
                onClick={() => navigate(`/history/${run.id}`)}
              >
                <RunStatusIcon status={run.status} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {run.scriptName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {new Date(run.startedAt).toLocaleString()}
                    {run.tableData
                      ? ` · ${run.tableData.rows.length} rows`
                      : ""}
                  </span>
                </span>
              </button>
            ))
          )}
        </SectionCard>
      </div>
    </>
  );
}
