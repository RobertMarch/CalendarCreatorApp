import { PropsWithChildren } from "react";
import { BatchConfigInput } from "./BatchConfigInput";
import { EventsEditor } from "./EventsEditor";
import { FileButtons } from "./FileButtons";
import { useBatchConfig } from "./types/calendar-batch-config";
import { useEvents } from "./types/calendar-event";

function App() {
  const { events, setEvents } = useEvents();
  const { batchConfig, setBatchConfig } = useBatchConfig();

  return (
    <>
      <div className="flex flex-col h-full space-y-4 p-8 bg-linear-to-r from-sky-200 to-teal-100">
        <h1 className="text-3xl font-bold">Calendar creator</h1>
        <Card>
          <FileButtons
            batchConfig={batchConfig}
            setBatchConfig={setBatchConfig}
            events={events}
            setEvents={setEvents}
          ></FileButtons>
        </Card>
        <Card>
          <BatchConfigInput
            batchConfig={batchConfig}
            setBatchConfig={setBatchConfig}
          ></BatchConfigInput>
        </Card>
        <Card>
          <EventsEditor
            events={events}
            setEvents={setEvents}
            batchConfig={batchConfig}
          ></EventsEditor>
        </Card>
        <Card>
          <Footer></Footer>
        </Card>
        <div className="flex-1"></div>
      </div>
    </>
  );
}

function Card({ children }: PropsWithChildren) {
  return <div className="p-4 bg-white rounded-lg">{children}</div>;
}

function Footer() {
  return (
    <div className="flex flex-col space-between space-y-2">
      <p>
        Create a ics calendar file to import into a calendar based on provided
        config, useful for when you have batches of events that are repeated on
        an irregular basis. The generated ics calendar file can be imported into
        calendar apps, note that all events are created without using
        timestamps, so events will be created at the specified time, regardless
        of your time zone. Events can be individually toggled to be included
        within the generated ICS file using the "Include" option beside each
        event.
      </p>
      <p>
        The batch name if provided will be added as a prefix to all events in
        the created calendar. The template name if provided is used when
        generating the file name when saving the template to file, or exporting
        to an ICS calendar, for ease of managing multiple sets of templates.
      </p>
      <p>
        This uses local storage in your browser to cache the latest events
        created, however it is recommended to download and store a copy of the
        events config to prevent losing data if this is cleared by the browser.
        If you wish to disable cookies, this can be done through your individual
        browser options.
      </p>
      <p>
        Check out the{" "}
        <a
          href="https://github.com/RobertMarch/CalendarCreatorApp"
          className="text-blue-600"
        >
          source code
        </a>
        .
      </p>
    </div>
  );
}

export default App;
