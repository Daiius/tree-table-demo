import { useState, useEffect } from 'react';

import { FocusMode } from './useTableCellFocus';

export type SyncStatus = "OK" | "Updating" | "Updated" | "Error"

export type UseAutoSyncCellArgs = {
  processType: string;
  nodeId: string;
  columnName: string;
  initialValue: string;
  focusMode: FocusMode;
}

export type UseAutoSyncCellHookResult = {
  value: string;
  setValue: (newValue: string) => void;
  status: SyncStatus;
  errorMessage: string;
}

const sleep = async (
  milliseconds: number
): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds));

export const useAutoSyncCell = ({
  //processType,
  //nodeId,
  //columnName,
  initialValue,
  focusMode
}: UseAutoSyncCellArgs) => {
  const [value, setValue] = useState<string>(initialValue);
  const [lastValue, setLastValue] = useState<string>(initialValue);
  const [lastFocusMode, setLastFocusMode] = useState<FocusMode>("Focused");
  const [status, setStatus] = useState<SyncStatus>("OK");

  // update cell data when focus changed from Editing -> Focused
  useEffect(() => {
    const asyncFunc = async () => {
      if (lastFocusMode === "Editing" && focusMode === "Focused") {
        if (lastValue != value) {
          setStatus("Updating");
          await sleep(1000);
          //await updateCondition();
          setStatus("Updated");
          setLastValue(value);
        }
      }
      setLastFocusMode(focusMode);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    asyncFunc();
  }, [focusMode]);

  // change status Updated -> OK after 10 seconds
  useEffect(() => {
    const asyncFunc = async () => {
      if (status === "Updated") {
        await sleep(10000);
        setStatus("OK");
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    asyncFunc();
  }, [status]);
  
  return {
    value,
    setValue,
    status,
    errorMessage: "test"
  };
};