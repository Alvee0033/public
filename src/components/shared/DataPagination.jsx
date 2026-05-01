import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function DataPagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    className = "",
}) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePreviousPage = () => {
        if (!isFirstPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (!isLastPage) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];

        // Always show the first page
        if (currentPage > 3) {
            pages.push(1);
            if (currentPage > 4) pages.push("...");
        }

        // Show current page +/- 1
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Always show last page
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`mt-12 flex justify-center ${className}`}>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePreviousPage}
                            disabled={isFirstPage}
                            className={`cursor-pointer transition-opacity duration-200 ${isFirstPage
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100"
                                }`}
                        />
                    </PaginationItem>

                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page)}
                                    isActive={currentPage === page}
                                    className={`cursor-pointer transition-colors duration-200 ${currentPage === page
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNextPage}
                            disabled={isLastPage}
                            className={`cursor-pointer transition-opacity duration-200 ${isLastPage
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100"
                                }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
