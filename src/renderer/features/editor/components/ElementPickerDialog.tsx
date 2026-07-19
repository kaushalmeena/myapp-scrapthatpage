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
import { TOAST_MESSAGES } from "@/lib/messages";
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

  const handlePickClick = async () => {
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
        toast.success(TOAST_MESSAGES.ELEMENT_PICK_SUCCESS);
      } else if (res.status === "error") {
        toast.error(res.message);
      }
      // status "cancelled" (user pressed Esc) is a deliberate no-op.
    } catch {
      toast.error(TOAST_MESSAGES.ELEMENT_PICK_FAILURE);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePickClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pick an element</DialogTitle>
          <DialogDescription>
            Enter the page to open. The scraper window loads it — hover to
            highlight elements and click the one you want; its selector fills in
            here. Hold Shift to interact with the page (scroll, follow links)
            without selecting, or press Esc to cancel.
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
          <Button disabled={!url.trim()} onClick={handlePickClick}>
            Open &amp; pick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
