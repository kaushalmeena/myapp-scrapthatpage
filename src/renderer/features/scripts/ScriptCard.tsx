import { Heart, Pencil, Play, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TOAST_MESSAGES } from "@/lib/messages";
import db from "@/database";
import { Script } from "@/types/script";
import { cn } from "@/lib/utils";

type ScriptCardProps = {
  script: Script;
};

function ScriptCard({ script }: ScriptCardProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleExecuteClick = () => navigate(`/execute/${script.id}`);

  const handleUpdateClick = () => navigate(`/update/${script.id}`);

  const handleDeleteConfirm = () => {
    if (script.id === undefined) {
      return;
    }
    db.deleteScriptById(script.id)
      .then(() => {
        toast.success(TOAST_MESSAGES.SCRIPT_DELETE_SUCCESS);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_DELETE_FAILURE);
      });
  };

  const handleFavoriteToggle = () => {
    if (script.id === undefined) {
      return;
    }
    const nextFavorite = 1 - script.favorite;
    const nextToastMessage = nextFavorite
      ? TOAST_MESSAGES.SCRIPT_FAVORITE_ADD
      : TOAST_MESSAGES.SCRIPT_FAVORITE_REMOVE;
    db.updateScriptFavoriteField(script.id, nextFavorite)
      .then(() => {
        toast.info(nextToastMessage);
      })
      .catch(() => {
        toast.error(TOAST_MESSAGES.SCRIPT_UPDATE_FAILURE);
      });
  };

  return (
    <Card className="flex flex-row items-center gap-2 p-3">
      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer rounded-md px-2 py-1 text-left transition-colors hover:bg-accent"
        onClick={handleExecuteClick}
      >
        <p className="truncate font-medium">{script.name}</p>
        <p className="truncate text-sm text-muted-foreground">
          {script.description}
        </p>
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="Execute script"
          onClick={handleExecuteClick}
        >
          <Play className="size-4 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Update script"
          onClick={handleUpdateClick}
        >
          <Pencil className="size-4 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title={
            script.favorite
              ? "Remove script from favorites"
              : "Add script to favorites"
          }
          onClick={handleFavoriteToggle}
        >
          <Heart
            className={cn(
              "size-4 text-primary",
              script.favorite && "fill-current"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Delete script"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <X className="size-4 text-destructive" />
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

export default ScriptCard;
