import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectInformation, updateInformation } from "./scriptEditorSlice";

function InformationPanel() {
  const dispatch = useAppDispatch();
  const information = useAppSelector(selectInformation);

  const handleInformationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    dispatch(
      updateInformation({ key: event.target.name, value: event.target.value })
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="script-name">Name</Label>
        <Input
          id="script-name"
          name="name"
          value={information.name.value}
          aria-invalid={Boolean(information.name.error)}
          onChange={handleInformationChange}
        />
        {information.name.error && (
          <p className="text-xs text-destructive">{information.name.error}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="script-description">Description</Label>
        <Textarea
          id="script-description"
          name="description"
          rows={5}
          value={information.description.value}
          aria-invalid={Boolean(information.description.error)}
          onChange={handleInformationChange}
        />
        {information.description.error && (
          <p className="text-xs text-destructive">
            {information.description.error}
          </p>
        )}
      </div>
    </div>
  );
}

export default InformationPanel;
