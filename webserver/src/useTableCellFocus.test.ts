import {
  useTableCellFocus
} from './useTableCellFocus';

import { renderHook, act } from '@testing-library/react';

const dummyRowIds = ["row-0", "row-1", "row-2"];
const dummyColumnNames = ["column-A", "column-B", "column-C"];

describe('useTableCellFocus Tests', () => {
  
  test('useTableCell initialization check', () => {
    const { result } = renderHook(() => useTableCellFocus());

    expect(result.current.focusPosition).toBeUndefined();
    expect(result.current.focusMode).toBe("Focused");
  });

});
