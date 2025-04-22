import { useRef } from "react";
import { BatchConfig } from "./calendar-batch-config";
import { CalendarEvent } from "./calendar-event";
import {
  downloadCalendarAsIcs,
  downloadEventsAsJson,
  readEventsFromJson,
} from "./file-utils";
import { StyledButton } from "./StyledComponents";

type ButtonsProps = {
  batchConfig: BatchConfig;
  events: CalendarEvent[];
  setEvents: (newEvents: CalendarEvent[]) => void;
};

export function FileButtons({ batchConfig, events, setEvents }: ButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const parsedData: CalendarEvent[] = await readEventsFromJson(
      event.target.files[0]
    );
    setEvents(parsedData);
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
        displayText="Import config from file"
        onClick={() => fileInputRef.current!.click()}
      ></StyledButton>
      <StyledButton
        displayText="Export to ics calendar"
        onClick={() => downloadCalendarAsIcs(batchConfig, events)}
        disabled={!events?.length || !batchConfig?.startDate}
      ></StyledButton>
      <StyledButton
        displayText="Export config to file"
        onClick={() => downloadEventsAsJson(events)}
        disabled={!events?.length}
      ></StyledButton>
    </>
  );
}
