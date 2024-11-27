/* eslint-disable */
import { useEffect, useState } from "react";
import PaginationComponent from "./TablePagination";

interface ManualPagination {
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  pageIndex: number;
  pageSize: number;
  totalSize: number;
}
const TableManualPaginationComponent = (props: ManualPagination) => {
  // Stores the first row index of the current page. If we have a page size of 10
  // and we are on the third page, index will be 21. This is used for when the pageSize
  // updates so we can update pageIndex correctly
  const [currentMinIndex, setCurrentMinIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(props.totalSize / props.pageSize));
    gotoPage(Math.floor(currentMinIndex / props.pageSize));
  }, [props.pageSize, props.totalSize]);

  useEffect(() => {
    setCurrentMinIndex(props.pageIndex * props.pageSize + 1);
  }, [props.pageIndex]);

  const previousPage = () => {
    gotoPage(Math.max(0, props.pageIndex - 1));
  };

  const nextPage = () => {
    gotoPage(props.pageIndex + 1);
  };

  const gotoPage = (page: number) => {
    props.setPageIndex(page);
  };

  return (
    <PaginationComponent
      gotoPage={gotoPage}
      previousPage={previousPage}
      pageSize={props.pageSize}
      nextPage={nextPage}
      pageCount={pageCount}
      pageIndex={props.pageIndex}
      pageOptions={{}} // This is not used by the component
      canPreviousPage={props.pageIndex !== 0}
      canNextPage={pageCount - 1 > props.pageIndex}
      setPageSize={props.setPageSize}
      totalSize={props.totalSize}
    />
  );
};

export default TableManualPaginationComponent;
