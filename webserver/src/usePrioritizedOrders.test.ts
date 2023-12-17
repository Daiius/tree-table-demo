import { renderHook, act } from '@testing-library/react';
import { usePrioritizedOrders } from './usePrioritizedOrders';

describe("usePrioritizedOrders Test", () => {
  test("initialization", () => {
    const { result } = renderHook(() => usePrioritizedOrders());

    expect(Object.keys(result.current.orderInfoDict).length).toBe(0);
  });

  test("toggle once change orderType into Ascending", () => {
    const { result } = renderHook(() => usePrioritizedOrders());
    const args = {
      commonParentId: "common_parent_id",
      commonProcessType: "common_process_type",
      columnName: "column_name"
    };
    act(() => result.current.toggleOrder(args));
    
    const orderInfoList = result.current.getOrderInfo(
      "common_parent_id", "common_process_type"
    );

    expect(orderInfoList?.length).toBe(1);
    expect(orderInfoList[0].orderType).toBe("Ascending");
    expect(orderInfoList[0].columnName).toBe("column_name");
  });

  test("toggle twice change orderType into Descending", () => {
    const { result } = renderHook(() => usePrioritizedOrders());
    const args = {
      commonParentId: "common_parent_id",
      commonProcessType: "common_process_type",
      columnName: "column_name"
    };
    act(() => result.current.toggleOrder(args));
    act(() => result.current.toggleOrder(args));

    const orderInfoList = result.current.getOrderInfo(
      "common_parent_id", "common_process_type"
    );

    expect(orderInfoList?.length).toBe(1);
    expect(orderInfoList[0].orderType).toBe("Descending");
    expect(orderInfoList[0].columnName).toBe("column_name");
  });

  test("toggle 3 times remove orderInfoDict entry", () => {
    const { result } = renderHook(() => usePrioritizedOrders());
    const args = {
      commonParentId: "common_parent_id",
      commonProcessType: "common_process_type",
      columnName: "column_name"
    };
    act(() => result.current.toggleOrder(args));
    act(() => result.current.toggleOrder(args));
    act(() => result.current.toggleOrder(args));
    
    const orderInfoList = result.current.getOrderInfo(
      "common_parent_id", "common_process_type"
    );

    expect(orderInfoList?.length).toBe(0);
  });
});
