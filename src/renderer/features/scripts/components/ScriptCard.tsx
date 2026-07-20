import { FileDown, Heart, Pencil, Play, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import db from "@/database";
import { TOAST_MESSAGES } from "@/lib/messages";
import { cn } from "@/lib/utils";
import type { Script } from "@/types/script";
import { exportScriptToJSON } from "../utils/scriptUtils";

export default function ScriptCard({ script }: { script: Script }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleExecuteClick = () => navigate(`/execute/${script.id}`);

  const handleUpdateClick = () => navigate(`/update/${script.id}`);

  const handleExportClick = () => exportScriptToJSON(script);

  const handleDeleteClick = () => setDeleteDialogOpen(true);

  const handleDeleteConfirm = () => {
    if (script.id === undefined) {
      return;
    }
    db.deleteScript(script.id)
      .then(() => {
        toast.success(TOAST_MESSAGES.SCRIPT_DELETE_SUCCESS);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_DELETE_FAILURE);
      });
  };

  const handleFavoriteToggle = () => {
    if (script.id === undefined) return;
    const nextFavorite = !script.favorite;
    const nextToastMessage = nextFavorite
      ? TOAST_MESSAGES.SCRIPT_FAVORITE_ADD
      : TOAST_MESSAGES.SCRIPT_FAVORITE_REMOVE;
    db.setScriptFavorite(script.id, nextFavorite)
      .then(() => {
        toast.info(nextToastMessage);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE);
      });
  };

  const operationCount = script.operations.length;

  return (
    <Card className="flex flex-row items-stretch gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
      {/* The whole text block is the primary target: clicking it runs the
          script, and the hover highlight fills the row edge-to-edge. */}
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer flex-col justify-center gap-0.5 px-4 py-3 text-left transition-colors hover:bg-accent"
        title="Execute script"
        onClick={handleExecuteClick}
      >
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate font-medium">{script.name}</p>
          {script.favorite ? (
            <Heart className="size-3.5 shrink-0 fill-red-500 text-red-500" />
          ) : null}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {script.description || "No description"}
        </p>
      </button>
      <div className="flex shrink-0 items-center gap-0.5 pr-2 pl-1">
        <Badge
          variant="secondary"
          className="mr-1 font-normal text-muted-foreground"
        >
          {operationCount} {operationCount === 1 ? "step" : "steps"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          title="Execute script"
          onClick={handleExecuteClick}
        >
          <Play className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          title="Update script"
          onClick={handleUpdateClick}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground hover:text-red-500",
            script.favorite && "text-red-500"
          )}
          title={
            script.favorite
              ? "Remove script from favorites"
              : "Add script to favorites"
          }
          onClick={handleFavoriteToggle}
        >
          <Heart className={cn("size-4", script.favorite && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          title="Export script as JSON"
          onClick={handleExportClick}
        >
          <FileDown className="size-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          title="Delete script"
          onClick={handleDeleteClick}
        >
          <X className="size-4" />
        </Button>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{script.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the script and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
