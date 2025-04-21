import { BatchConfig } from "./calendar-batch-config";
import { formatDateForInput } from "./date-utils";
import { StyledInput } from "./StyledComponents";

type BatchConfigInputProps = {
  batchConfig: BatchConfig;
  setBatchConfig: (newBatchConfig: BatchConfig) => void;
};

export function BatchConfigInput({
  batchConfig,
  setBatchConfig,
}: BatchConfigInputProps) {
  function setProperty(newValue: any, propertyName: keyof BatchConfig): void {
    const nextConfig: BatchConfig = {
      ...batchConfig,
      [propertyName]: newValue,
    };
    setBatchConfig(nextConfig);
  }

  return (
    <div className="flex flex-row space-between space-x-6">
      <StyledInput
        label="Start date"
        value={formatDateForInput(batchConfig.startDate)}
        setValue={(val) => setProperty(new Date(val), "startDate")}
        type="date"
      ></StyledInput>
      <StyledInput
        label="Batch name"
        value={batchConfig.batchName}
        setValue={(val) => setProperty(val, "batchName")}
      ></StyledInput>
    </div>
  );
}
