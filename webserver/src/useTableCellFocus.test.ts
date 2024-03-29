import {
  useTableCellFocus,
} from './useTableCellFocus';

import { renderHook, act } from '@testing-library/react';

const dummyRowIds: string[] = ["row-0", "row-1", "row-2"];
const dummyColumnNames: string[] = ["column-A", "column-B", "column-C"];
const dummyCommonParentId: string = "dummyParentId";
const dummyCommonProcessType: string = "dummyProcessType";

describe('useTableCellFocus Tests', () => {
  
  test('initialization check', () => {
    const { result } = renderHook(() => useTableCellFocus());

    expect(result.current.focusPosition).toBeUndefined();
    expect(result.current.focusMode).toBe("Focused");
  });

  test('setFocus to same cell make focusMode "Editing"', () => {
    const { result } = renderHook(() => useTableCellFocus());
    const args = {
      commonParentId: dummyCommonParentId,
      commonProcessType: dummyCommonProcessType,
      rowNodeId: dummyRowIds[0],
      columnName: dummyColumnNames[0],
      rowNodeIds: dummyRowIds,
      columnNames: dummyColumnNames,
    };
    // NOTE
    // two ast() calls are needed to emulate two setFocus() calls
    act(() => result.current.setFocus(args));
    act(() => result.current.setFocus(args));
    expect(result.current.focusPosition?.commonParentId).toBe(dummyCommonParentId);
    expect(result.current.focusPosition?.commonProcessType).toBe(dummyCommonProcessType);
    expect(result.current.focusMode).toBe("Editing");
  });

  it('then moveFocus to the next cell changes focusMode "Focused"', () => {
    const { result } = renderHook(() => useTableCellFocus());
    const args = {
      commonParentId: dummyCommonParentId,
      commonProcessType: dummyCommonProcessType,
      rowNodeId: dummyRowIds[0],
      columnName: dummyColumnNames[0],
      rowNodeIds: dummyRowIds,
      columnNames: dummyColumnNames,
    };
    // NOTE
    // two ast() calls are needed to emulate two setFocus() calls
    act(() => result.current.setFocus(args));
    act(() => result.current.setFocus(args));

    act(() => result.current.moveFocus({ drow: 0, dcolumn: 1 }));

    expect(result.current.focusPosition?.commonParentId)
      .toBe(dummyCommonParentId);
    expect(result.current.focusPosition?.commonProcessType)
      .toBe(dummyCommonProcessType);
    expect(result.current.focusPosition?.rowNodeId)
      .toBe(dummyRowIds[0]);
    expect(result.current.focusPosition?.columnName)
      .toBe(dummyColumnNames[1]);
    expect(result.current.focusMode).toBe("Focused");
    
  });

});
