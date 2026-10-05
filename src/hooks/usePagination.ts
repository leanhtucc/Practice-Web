import { useState } from "react";

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
}

export function usePagination<T>(
  data: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = itemsPerPage > 0 ? itemsPerPage : 1;
  const totalPages = Math.ceil(data.length / pageSize);

  const page = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * pageSize;

  const endIndex = startIndex + pageSize;

  const currentItems = data.slice(startIndex, endIndex);

  const next = () => {
    setCurrentPage(page < totalPages ? page + 1 : page);
  };

  const prev = () => {
    setCurrentPage(page > 1 ? page - 1 : page);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage: page,
    totalPages,
    currentItems,
    next,
    prev,
    goToPage,
  };
}
