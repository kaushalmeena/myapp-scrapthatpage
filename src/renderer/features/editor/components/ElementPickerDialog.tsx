import { type KeyboardEvent, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectFirstOpenUrl } from "../scriptEditorSlice";

// Prompts for a URL, opens it in the scraper window, then lets the user click
// an element there and reports back its CSS selector.
export default function ElementPickerDialog({
  open,
  onOpenChange,
  onPicked
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPicked: (selector: string) => void;
}) {
  const urlInputId = useId();
  // Default to the page the script already opens, so picking usually targets
  // the right site without retyping.
  const defaultUrl = useAppSelector(selectFirstOpenUrl);
  const [url, setUrl] = useState(defaultUrl);

  useEffect(() => {
    if (open) {
      setUrl(defaultUrl);
    }
  }, [open, defaultUrl]);

  const handlePick = async () => {
    const raw = url.trim();
    if (!raw) return;
    // Accept bare hosts like "example.com" by defaulting to https.
    const target = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    onOpenChange(false);
    try {
      await window.scraper.loadURL(target);
      const res = await window.scraper.pickElement();
      if (res.status === "success") {
        onPicked(res.selector);
        toast.success("Element picked");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Couldn't open that page. Check the URL and try again.");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pick an element</DialogTitle>
          <DialogDescription>
            Enter the page to open. The scraper window will load it — then click
            the element you want and its selector fills in here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={urlInputId}>Page URL</Label>
          {/* biome-ignore lint/a11y/noAutofocus: focusing the sole field on open is expected */}
          <Input
            id={urlInputId}
            autoFocus
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!url.trim()} onClick={handlePick}>
            Open &amp; pick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
