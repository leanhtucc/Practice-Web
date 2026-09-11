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

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex);

  const next = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const prev = () => {
    setCurrentPage((prevPage) =>
      prevPage > 1 ? prevPage - 1 : prevPage
    );
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    next,
    prev,
    goToPage,
  };
}
