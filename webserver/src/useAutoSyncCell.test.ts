import { useAutoSyncCell } from 'useAutoSyncCell';

import { getAPIUrl } from 'communications';
import { renderHook, act, waitFor } from '@testing-library/react';

jest.mock('communications', () => ({
  ...jest.requireActual('communications'),
  getAPIUrl: jest.fn().mockReturnValue("http://tree-table-demo-webapi:8000")
}));

describe('useAutoSyncCell custum hook test', () => {
  it('simple update test', async () => {
    const { result } = renderHook(() => useAutoSyncCell(
      {
        processType: "material",
        nodeId: "0",
        columnName: "variety",
        initialValue: "good tomatoes",
        focusMode: "Focused",
      }
    ));

    act(() => result.current.setValue("excelent tomatoes"));

    await waitFor(() => expect(result.current.value).toBe("excelent tomatoes"));

    expect(result.current.value).toBe("excelent tomatoes");
  });

  it('inserting new entry', async () => {
    const { result } = renderHook(() => useAutoSyncCell(
      {
        processType: "material",
        nodeId: "900",
        parentId: undefined,
        columnName: "variety",
        initialValue: "",
        focusMode: "Focused"
      }
    ));

    act(() => result.current.setValue("poor tomatoes"));

    await waitFor(() => expect(result.current.value).toBe("poor tomatoes"));

    expect(result.current.value).toBe("poor tomatoes");
  });
});
