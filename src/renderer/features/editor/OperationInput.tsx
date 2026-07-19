import { CopyPlus, Crosshair } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useId, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/lib/utils";
import OperationsPanel from "./OperationsPanel";
import {
  selectFirstOpenUrl,
  showVariableSelector,
  updateInput
} from "./scriptEditorSlice";

export default function OperationInput({
  operationId,
  inputIndex,
  numberPrefix
}: {
  operationId: string;
  inputIndex: number;
  // Number prefix for nested operation lists rendered by box inputs.
  numberPrefix: string;
}) {
  const dispatch = useAppDispatch();
  const inputId = useId();
  const urlInputId = useId();
  const input = useAppSelector(
    (s) => s.scriptEditor.operations[operationId]?.inputs[inputIndex]
  );
  // Pre-fill the picker's URL with the script's first "open" step, so picking
  // usually targets the same page the script scrapes.
  const defaultPickUrl = useAppSelector(selectFirstOpenUrl);

  const [picking, setPicking] = useState(false);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [pickUrl, setPickUrl] = useState("");

  if (!input) {
    return null;
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      updateInput({ operationId, inputIndex, value: event.target.value })
    );

  const handleSelectChange = (value: string) =>
    dispatch(updateInput({ operationId, inputIndex, value }));

  const handleVariablePickerOpen = () =>
    dispatch(showVariableSelector({ operationId, inputIndex }));

  const handleElementPickerOpen = () => {
    setPickUrl(defaultPickUrl);
    setUrlDialogOpen(true);
  };

  const handleElementPick = async () => {
    const raw = pickUrl.trim();
    if (!raw) {
      return;
    }
    // Accept bare hosts like "example.com" by defaulting to https.
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    setUrlDialogOpen(false);
    setPicking(true);
    try {
      await window.scraper.loadURL(url);
      const res = await window.scraper.pickElement();
      if (res.status === "success") {
        dispatch(updateInput({ operationId, inputIndex, value: res.selector }));
        toast.success("Element picked");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Couldn't open that page. Check the URL and try again.");
    } finally {
      setPicking(false);
    }
  };

  const handleUrlKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleElementPick();
    }
  };

  switch (input.type) {
    case "text": {
      const hasVariablePicker = Boolean(input.variablePicker);
      const hasElementPicker = Boolean(input.elementPicker);
      const inputPadding =
        hasVariablePicker && hasElementPicker
          ? "pr-14"
          : hasVariablePicker || hasElementPicker
            ? "pr-8"
            : "";
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={inputId}>{input.label}</Label>
          <div className="relative">
            <Input
              id={inputId}
              className={cn("h-8", inputPadding)}
              value={input.value}
              readOnly={input.inputProps?.readOnly}
              placeholder={input.inputProps?.placeholder}
              type={input.inputProps?.type}
              aria-invalid={Boolean(input.error)}
              onChange={handleInputChange}
            />
            {hasVariablePicker && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Show variable picker"
                className="absolute top-1 right-1"
                onClick={handleVariablePickerOpen}
              >
                <CopyPlus className="size-4" />
              </Button>
            )}
            {hasElementPicker && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Pick element from page"
                className={cn(
                  "absolute top-1",
                  hasVariablePicker ? "right-8" : "right-1"
                )}
                disabled={picking}
                onClick={handleElementPickerOpen}
              >
                <Crosshair className="size-4" />
              </Button>
            )}
          </div>
          {input.error && (
            <p className="text-xs text-destructive">{input.error}</p>
          )}
          <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pick an element</DialogTitle>
                <DialogDescription>
                  Enter the page to open. The scraper window will load it — then
                  click the element you want and its selector fills in here.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={urlInputId}>Page URL</Label>
                {/* biome-ignore lint/a11y/noAutofocus: focusing the sole field on open is expected */}
                <Input
                  id={urlInputId}
                  autoFocus
                  placeholder="https://example.com"
                  value={pickUrl}
                  onChange={(event) => setPickUrl(event.target.value)}
                  onKeyDown={handleUrlKeyDown}
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setUrlDialogOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!pickUrl.trim()} onClick={handleElementPick}>
                  Open &amp; pick
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    case "select":
      return (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={inputId}>{input.label}</Label>
          <Select value={input.value} onValueChange={handleSelectChange}>
            <SelectTrigger
              id={inputId}
              size="sm"
              className="w-full"
              aria-invalid={Boolean(input.error)}
            >
              <SelectValue placeholder={input.label} />
            </SelectTrigger>
            <SelectContent>
              {input.options.map((option) => (
                <SelectItem
                  key={`${operationId}-${inputIndex}-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {input.error && (
            <p className="text-xs text-destructive">{input.error}</p>
          )}
        </div>
      );
    case "operation_box":
      return (
        <OperationsPanel
          listRef={{ parentId: operationId, inputIndex }}
          numberPrefix={numberPrefix}
        />
      );
  }
}
