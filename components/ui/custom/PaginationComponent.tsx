"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

export function PaginationComponent({ currentPage, onPageChange, pageSize, totalItems }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // If the total number of pages is less than the max number of visible pages we want to show on the screen, just
      // show all pages.
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={"cursor-pointer"}
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Otherwise, figure out which pages to show.
      const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      if (startPage > 0) {
        // Always show the first page explicitly.
        pageNumbers.push(
          <PaginationItem key={0}>
            <PaginationLink className={"cursor-pointer"} onClick={() => handlePageChange(0)}>
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 1) {
          // If the second page isn't being shown, show an ellipsis.
          pageNumbers.push(<PaginationEllipsis key="ellipsis-start" />);
        }
      }

      // Show the pages nearby the current page.
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={"cursor-pointer"}
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages - 1) {
        // If the second to last page isn't being shown, show an ellipsis.
        if (endPage < totalPages - 2) {
          pageNumbers.push(<PaginationEllipsis key="ellipsis-end" />);
        }
        // Always show the last page explicitly.
        pageNumbers.push(
          <PaginationItem key={totalPages - 1}>
            <PaginationLink className={"cursor-pointer"} onClick={() => handlePageChange(totalPages - 1)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pageNumbers;
  };

  const prevDisabled = currentPage === 0;
  const nextDisabled = currentPage === totalPages - 1;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={nextDisabled}
            className={`${prevDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            aria-disabled={prevDisabled}
            className={`${nextDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
