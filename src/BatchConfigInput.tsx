import { BatchConfig } from "./calendar-batch-config";

type CalendarBatchConfigProps = {
  batchConfig: BatchConfig;
  setBatchConfig: (newBatchConfig: BatchConfig) => void;
};

export function BatchConfigInput({
  batchConfig,
  setBatchConfig,
}: CalendarBatchConfigProps) {
  return (
    <div>
      <p>
        Batch name:
        {batchConfig.batchName}
      </p>
      <p>
        Start date:
        {batchConfig.startDate?.toDateString() || ""}
      </p>
    </div>
  );
}
