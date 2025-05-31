import { useState } from "react";

export interface BatchConfig {
  startDate?: Date;
  batchName: string;
  templateName: string;
}

export function useBatchConfig() {
  const cachedConfig: BatchConfig = deserialiseBatchConfig(
    localStorage.getItem("batch-config")
  );

  const [batchConfig, setBatchConfig] = useState<BatchConfig>(cachedConfig);

  const saveConfig = (newConfig: BatchConfig) => {
    localStorage.setItem("batch-config", JSON.stringify(newConfig));
    setBatchConfig(newConfig);
  };

  return {
    batchConfig,
    setBatchConfig: saveConfig,
  };
}

function deserialiseBatchConfig(jsonString: string | null): BatchConfig {
  if (!jsonString) {
    return {
      startDate: undefined,
      batchName: "",
      templateName: "",
    };
  }

  const jsonObj: any = JSON.parse(jsonString);

  return {
    startDate:
      (jsonObj.startDate ? new Date(jsonObj.startDate) : undefined) ||
      undefined,
    batchName: jsonObj.batchName || "",
    templateName: jsonObj.templateName || "",
  };
}
