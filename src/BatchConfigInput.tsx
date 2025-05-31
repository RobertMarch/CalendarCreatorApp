import { StyledInput } from "./StyledComponents";
import { BatchConfig } from "./types/calendar-batch-config";
import { formatDateForInput } from "./utils/date-utils";

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
    <div className="flex flex-col space-between space-y-2">
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
      <StyledInput
        label="Template name"
        value={batchConfig.templateName}
        setValue={(val) => setProperty(val, "templateName")}
      ></StyledInput>
    </div>
  );
}
