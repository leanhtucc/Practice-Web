import { act, renderHook } from "@testing-library/react";

import { usePagination } from "./usePagination";

afterEach(() => {
  jest.clearAllMocks();
});

it("chuyển trang tiến và lùi trong giới hạn danh sách", () => {
  // Arrange
  const { result } = renderHook(() => usePagination(["A", "B", "C"], 2));

  // Act
  act(() => result.current.next());

  // Assert
  expect(result.current.currentPage).toBe(2);
  expect(result.current.currentItems).toEqual(["C"]);

  // Act
  act(() => result.current.prev());

  // Assert
  expect(result.current.currentPage).toBe(1);
  expect(result.current.currentItems).toEqual(["A", "B"]);
});

it("giới hạn trang hiện tại khi danh sách ngắn lại", () => {
  // Arrange
  const { result, rerender } = renderHook(
    ({ data }: { data: number[] }) => usePagination(data, 2),
    { initialProps: { data: [1, 2, 3, 4, 5] } }
  );
  act(() => result.current.goToPage(3));

  // Act
  rerender({ data: [1, 2, 3] });

  // Assert
  expect(result.current.currentPage).toBe(2);
  expect(result.current.currentItems).toEqual([3]);
});

it("giữ trang một khi danh sách rỗng", () => {
  // Arrange
  const { result } = renderHook(() => usePagination<string>([], 4));

  // Act
  act(() => result.current.next());

  // Assert
  expect(result.current.totalPages).toBe(0);
  expect(result.current.currentPage).toBe(1);
  expect(result.current.currentItems).toEqual([]);
});

it.each([0, -2])("coi kích thước trang %i là một", (itemsPerPage) => {
  // Arrange
  const { result } = renderHook(() => usePagination(["X", "Y"], itemsPerPage));

  // Act
  act(() => result.current.next());

  // Assert
  expect(result.current.totalPages).toBe(2);
  expect(result.current.currentItems).toEqual(["Y"]);
});

it("bỏ qua yêu cầu chuyển tới trang ngoài phạm vi", () => {
  // Arrange
  const { result } = renderHook(() => usePagination([1, 2, 3], 2));

  // Act
  act(() => result.current.goToPage(3));

  // Assert
  expect(result.current.currentPage).toBe(1);
});
