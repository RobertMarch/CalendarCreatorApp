import { useRef } from "react";
import { StyledButton } from "./StyledComponents";
import { BatchConfig } from "./types/calendar-batch-config";
import { CalendarEvent } from "./types/calendar-event";
import { CalendarTemplate } from "./types/calendar-template";
import {
  downloadCalendarAsIcs,
  downloadEventsAsJson,
  readTemplateFromJson,
} from "./utils/file-utils";

type ButtonsProps = {
  batchConfig: BatchConfig;
  setBatchConfig: (newBatchConfig: BatchConfig) => void;
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
};

export function FileButtons({
  batchConfig,
  setBatchConfig,
  events,
  setEvents,
}: ButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const parsedData: CalendarTemplate = await readTemplateFromJson(
      event.target.files[0]
    );
    setEvents(parsedData.events);
    setBatchConfig({
      startDate: undefined,
      batchName: "",
      templateName: parsedData.templateName,
    });
  };

  return (
    <>
      <input
        hidden
        type="file"
        accept=".json,application/json"
        onChange={onFileUpload}
        ref={fileInputRef}
      ></input>
      <StyledButton
        displayText="Load template from file"
        onClick={() => fileInputRef.current!.click()}
      ></StyledButton>
      <StyledButton
        displayText="Export to ics calendar"
        onClick={() => downloadCalendarAsIcs(batchConfig, events)}
        disabled={!events?.length || !batchConfig?.startDate}
      ></StyledButton>
      <StyledButton
        displayText="Save template to file"
        onClick={() => downloadEventsAsJson(batchConfig, events)}
        disabled={!events?.length}
      ></StyledButton>
    </>
  );
}
