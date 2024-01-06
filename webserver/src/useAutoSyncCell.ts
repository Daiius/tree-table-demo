import { useState, useEffect } from 'react';

import axios from 'axios';
import { getAPIUrl } from 'communications';

import { FocusMode } from './useTableCellFocus';
import { sleep } from './commonTypes';



export type SyncStatus = "OK" | "Updating" | "Updated" | "Error"

export type UseAutoSyncCellArgs = {
  processType: string;
  parentId?: string;
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


export const useAutoSyncCell = ({
  processType,
  parentId,
  nodeId,
  columnName,
  initialValue,
  focusMode
}: UseAutoSyncCellArgs) => {
  const [value, setValue] = useState<string>(initialValue);
  const [lastValue, setLastValue] = useState<string>(initialValue);
  const [lastFocusMode, setLastFocusMode] = useState<FocusMode>("Focused");
  const [status, setStatus] = useState<SyncStatus>("OK");
  const [errorMessage, setErrorMessage] = useState<string|undefined>();
  
  // to detect initialValue (from database) is changed
  const [lastInitialValue, setLastInitialValue] = useState<string>(initialValue);

  // update cell data when focus changed from Editing -> Focused
  useEffect(() => {
    if (lastFocusMode === "Editing" && focusMode === "Focused") {
      if (lastValue != value) {
        setStatus("Updating");
        axios.put(
          getAPIUrl() + `/api/process/${processType}/${nodeId}`,
          {
            conditions: {
              [columnName]: {
                newValue: value,
                oldValue: lastValue
              },
            }, 
            parentId
          },
          { headers: { "Content-Type": "application/json" }}
        ).then(response => {
          //if (!response.ok) throw Error(
          //  "Error occurred during fetch, " + response.statusText
          //);
          setStatus("Updated");
          setLastValue(value);
          setErrorMessage(undefined);
        }).catch(e => {
          setStatus("Error");
          if (e instanceof Error) {
            setErrorMessage(e.toString());
          } else {
            setErrorMessage("unknown error during fetch...");
          }
        });
      }
    }
    setLastFocusMode(focusMode);
  }, [focusMode]);

  // change status Updated -> OK after 10 seconds
  useEffect(() => {
    if (status === "Updated") {
      sleep(10000).then(() =>
        setStatus("OK")
      ).catch(e => console.log(e));
    }
  });

  // update initial value when background update
  useEffect(() => {
    if (initialValue != lastInitialValue) {
      setValue(initialValue);
      setLastValue(initialValue);
      setStatus("Updated");

      setLastInitialValue(initialValue);
    }
  }, [initialValue]);
  
  return {
    value,
    setValue,
    status,
    errorMessage
  };
};
