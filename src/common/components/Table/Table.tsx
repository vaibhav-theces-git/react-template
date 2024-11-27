/* eslint-disable */
import {
  useTable,
  Column,
  usePagination,
  useSortBy,
  TableOptions,
  useFilters,
  useFlexLayout,
  useExpanded,
  Filters,
  Row,
  useRowSelect,
} from "react-table";
import React, {
  forwardRef,
  Fragment,
  memo,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import cx from "classnames";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import If from "../conditional/If";
import TableComponent from "./TableComponent";
import ThComponent from "./ThComponent";
import TheadComponent from "./TheadComponent";
import TrComponent from "./TrComponent";
import TbodyComponent from "./TbodyComponent";
import TdComponent from "./TdComponent";
import PaginationComponent from "./TablePagination";
import {
  sortStringWithoutCase,
  sortNumbers,
  sortAbsoluteNumbers,
  sortUserNameObjectWithoutCase,
} from "./sorting";
import {
  commonTableSectionTID,
  noDataMessage,
} from "src/common/constants/testids";

interface TableProps<T extends object> extends TableOptions<T> {
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableExpanding?: boolean;
  columns: any;
  enableFilters?: boolean;
  getFilterGroupProps?: () => Record<string, any>;
  getSubRows?: (row: any) => any[];
  renderRowSubComponent?: any;
  className?: string;
  indentSubrows?: boolean;
  subRowBackground?: boolean;
  onFilterChange?: (filters: Filters<Object>) => void;
  renderDownloadComponent?: (rows: Array<Row<T>>) => ReactNode;
  DownloadComponent?: ReactNode;
  noDataTableClasses?: string;
  noDataTableMessage?: string | ReactNode;
  enableRowSelection?: boolean;
  onSelectedRowsChange?: (selectedFlatRows: any) => void;
  handleSelectedRowComponent?: (selectedFlatRows: any) => ReactNode;
  unselectAll?: boolean;
  rowStyles?: (row: any) => string;
  onRowClick?: (row: any) => void;
}

// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: any;
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const TableNoDataComponent = ({
  containerClass,
  message,
}: {
  containerClass: string;
  message: string | ReactNode;
}) => {
  return (
    <div
      className={cx(
        "tw-flex tw-min-h-[100px] tw-items-center tw-justify-center",
        containerClass
      )}
    >
      {message}
    </div>
  );
};
const TableLoaderComponent = () => {
  return (
    <div className="tw-flex tw-min-h-[300px] tw-items-center tw-justify-center">
      Loading...
    </div>
  );
};

const generateUseTableOptions = ({
  data,
  columns,
  enableSorting,
  manualFilters,
  enablePagination,
  enableExpanding,
  initialState,
  enableFilters,
  autoResetResize = false,
  getSubRows,
  renderRowSubComponent,
  autoResetPage = false,
  autoResetSortBy,
  autoResetFilters,
  enableRowSelection,
  align,
}: any) => {
  const hooksUsing = [];
  let sortOptions = {};
  let expandOptions = {};
  if (enableFilters === true) {
    hooksUsing.push(useFilters);
  }
  if (enableSorting !== false) {
    hooksUsing.push(useSortBy);
    sortOptions = {
      autoResetSortBy: false,
      sortTypes: {
        stringIgnoreCase: sortStringWithoutCase,
        sortNumbers: sortNumbers,
        sortAbsoluteNumbers: sortAbsoluteNumbers,
        sortUserNameObjectWithoutCase: sortUserNameObjectWithoutCase,
      },
    };
  }
  if (enableExpanding === true) {
    hooksUsing.push(useExpanded);
    if (getSubRows) {
      expandOptions = {
        getSubRows,
        autoResetExpanded: false,
        paginateExpandedRows: false,
      };
    } else {
      expandOptions = {
        autoResetExpanded: false,
      };
    }
  }
  if (enablePagination !== false) {
    hooksUsing.push(usePagination);
  }
  if (enableRowSelection !== false) {
    hooksUsing.push(useRowSelect);
  }
  hooksUsing.push(useFlexLayout);
  return {
    options: {
      ...sortOptions,
      ...expandOptions,
      columns,
      data,
      manualFilters,
      initialState: {
        ...initialState,
        hiddenColumns: columns.map((column: any) => {
          if (column.show === false) return column.accessor || column.id;
        }),
      },
      autoResetResize,
      autoResetPage,
      autoResetSortBy,
      autoResetFilters,
      defaultColumn: {
        Filter: DefaultColumnFilter,
        minWidth: 5,
        width: 15,
      },
    },
    hooks: hooksUsing,
  };
};

const splitProps = ({
  className,
  wrapperClassName,
  style,
  ...rest
}: Record<string, any>) => {
  return {
    className,
    style,
    wrapperClassName,
    rest: rest || [],
  };
};

const Table = forwardRef(
  <T extends object>(
    {
      data,
      columns,
      centerCells = false,
      enableSorting = true,
      enablePagination = true,
      enableExpanding = false,
      enableFilters = false,
      enableRowSelection = false,
      manualFilters = false,
      getFilterGroupProps = () => ({}),
      initialState,
      isLoading = false,
      autoResetResize = false,
      autoResetPage = false,
      autoResetSortBy = false,
      autoResetFilters = false,
      className,
      getSubRows,
      renderRowSubComponent,
      DownloadComponent,
      renderDownloadComponent,
      indentSubrows = true,
      subRowBackground = false,
      noDataTableClasses = "",
      noDataTableMessage = noDataMessage,
      onFilterChange,
      onSelectedRowsChange,
      handleSelectedRowComponent,
      unselectAll,
      rowStyles,
      onRowClick,
      forceResetRowSelection = () => ({}),
    }: PropsWithChildren<TableProps<T>>,
    ref: any
  ) => {
    const { options, hooks } = generateUseTableOptions({
      data,
      columns,
      enableSorting,
      enablePagination,
      enableExpanding,
      autoResetResize,
      autoResetPage,
      autoResetSortBy,
      autoResetFilters,
      enableFilters,
      manualFilters,
      initialState,
      getSubRows,
      enableRowSelection,
      forceResetRowSelection,
    });

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      visibleColumns,
      pageOptions,
      page,
      pageCount,
      state: { pageIndex, pageSize, filters },
      gotoPage,
      previousPage,
      nextPage,
      setPageSize,
      canPreviousPage,
      canNextPage,
      selectedFlatRows,
      toggleAllRowsSelected,
    } = useTable<T>(options, ...hooks);

    useEffect(() => {
      if (gotoPage) {
        gotoPage(0);
      }
      if (onFilterChange) {
        onFilterChange(filters);
      }
    }, [filters]);

    useEffect(() => {
      if (onSelectedRowsChange) {
        onSelectedRowsChange(selectedFlatRows);
      }
    }, [selectedFlatRows]);

    useEffect(() => {
      if (unselectAll) {
        toggleAllRowsSelected(false);
      }
    });

    useImperativeHandle(ref, () => ({
      resetPagination() {
        gotoPage(0);
      },
    }));

    const filterProps = splitProps(getFilterGroupProps());
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(-1);

    return (
      <div className="tw-w-full tw-overflow-auto">
        {(enableFilters || DownloadComponent) && (
          <div
            className={cx(
              "tw-flex tw-align-center",
              filterProps.wrapperClassName
            )}
          >
            {enableFilters && (
              <div
                className={cx(
                  filterProps.className,
                  "tw-flex tw-mt-4",
                  enableRowSelection
                    ? "tw-w-[75%] tw-bg-black"
                    : "tw-items-center tw-text-center tw-justify-center tw-px-3"
                )}
                style={filterProps.style}
                {...filterProps.rest}
              >
                {headerGroups.map((headerGroup, i: number) => {
                  return headerGroup.headers.map((column, j: number) => {
                    return (
                      <React.Fragment key={`${i}-${j}`}>
                        {column.canFilter ? (
                          <div className={cx("tw-pr-1")}>
                            {column.render("Filter")}
                          </div>
                        ) : null}
                      </React.Fragment>
                    );
                  });
                })}
              </div>
            )}
            {enableRowSelection && handleSelectedRowComponent && (
              <div className="tw-w-[25%] tw-flex tw-items-end tw-text-right tw-justify-end tw-py-2">
                <div> {handleSelectedRowComponent(selectedFlatRows)} </div>
              </div>
            )}
            {renderDownloadComponent && (
              <span className="tw-ml-auto tw-self-center tw-px-4 tw-pt-2">
                {renderDownloadComponent(rows)}
              </span>
            )}
            {DownloadComponent && renderDownloadComponent === undefined && (
              <span className="tw-ml-auto tw-self-center tw-px-4 tw-pt-2">
                {DownloadComponent}
              </span>
            )}
          </div>
        )}

        <TableComponent
          {...getTableProps(() => {
            return {};
          })}
          className={cx(
            "tw-border-0 tw-text-sm tw-bg-grey-500 tw-text-white tw-table-fixed  tw-min-w-full tw-relative",
            className
          )}
          data-testid={commonTableSectionTID}
        >
          <TheadComponent className="tw-text-white  tw-bg-slate-50 tw-sticky tw-top-0">
            {headerGroups.map((headerGroup) => (
              <TrComponent
                {...headerGroup.getHeaderGroupProps()}
                className="tw-px-2"
              >
                {headerGroup.headers.map((column) => {
                  let col = column as any;

                  const hasChildColumns =
                    column.columns === undefined ? false : true;
                  const { onClick: onClickSort, ...otherToggleProps } =
                    enableSorting && column.canSort
                      ? column.getSortByToggleProps()
                      : { onClick: undefined };

                  return (
                    <ThComponent
                      {...column.getHeaderProps(
                        enableSorting ? otherToggleProps : undefined
                      )}
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        if (enableSorting && column.canSort) {
                          if (onClickSort) {
                            onClickSort(e);
                            if (gotoPage) {
                              gotoPage(0);
                            }
                          }
                        }
                      }}
                      title=""
                      className={cx([
                        "tw-text-left tw-font-normal 3xl:tw-text-base tw-text-xs tw-align-middle tw-leading-tight tw-relative tw-text-ellipsis",
                        {
                          "tw-py-2 tw-pl-2 tw-pr-2  tw-flex": !hasChildColumns,
                        },
                      ])}
                    >
                      <>
                        <div
                          className={cx([
                            "tw-flex tw-items-center tw-overflow-hidden",
                            { "tw-flex-grow": !hasChildColumns },
                            { "tw-h-full tw-w-full": hasChildColumns },
                            { "tw-justify-start": col.align === "left" },
                            { "tw-justify-end": col.align === "right" },
                            { "tw-justify-center": col.align === "center" },
                          ])}
                        >
                          <div
                            className={cx([
                              "tw-overflow-hidden tw-text-ellipsis tw-break-normal",
                              { "tw-max-w-fit": !hasChildColumns },
                              { "tw-h-full tw-w-full": hasChildColumns },
                            ])}
                          >
                            {column.render("Header")}
                          </div>
                          {column.isSorted ? (
                            <div className="tw-relative tw-right-0 tw-z-10">
                              {column.isSortedDesc ? (
                                <ArrowDropDownIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              ) : (
                                <ArrowDropUpIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              )}
                            </div>
                          ) : column.canSort ? (
                            <div className="tw-relative tw-right-0 tw-z-10">
                              <ArrowDropUpIcon fontSize="small" opacity={0.3} />
                            </div>
                          ) : null}
                        </div>
                      </>
                    </ThComponent>
                  );
                })}
              </TrComponent>
            ))}
          </TheadComponent>

          <If condition={!isLoading && !rows?.length}>
            <TableNoDataComponent
              containerClass={noDataTableClasses}
              message={noDataTableMessage}
            />
          </If>
          <If condition={isLoading}>
            <TableLoaderComponent />
          </If>
          <If condition={!isLoading && data?.length > 0}>
            <TbodyComponent
              {...getTableBodyProps()}
              className="tw-h-full tw-overflow-y-auto"
            >
              {(enablePagination ? page : rows).map((row) => {
                prepareRow(row);
                let style = {};
                let subcomponentClassName = "";
                if (enableExpanding) {
                  if (indentSubrows) {
                    style = { paddingLeft: `${row.depth * 12}px` };
                  }
                  if (subRowBackground) {
                    subcomponentClassName += "tw-bg-primary tw-px-0";
                  }
                }

                return (
                  <Fragment key={`${row.getRowProps().key}-fragment`}>
                    <TrComponent
                      {...row.getRowProps()}
                      className={cx(
                        "react-table-row",
                        " tw-bg-slate-25",
                        "tw-border-0",
                        "tw-flex",
                        "tw-border-b",
                        "tw-border-solid",
                        "tw-border-slate-75",
                        {
                          "tw-cursor-pointer": onRowClick,
                          "hover:tw-bg-tertiary": onRowClick,
                        },
                        selectedRowIndex === row.index ? "tw-bg-stone-600" : "",
                        rowStyles ? rowStyles(row.original) : "",
                        subRowBackground && row.depth > 0
                          ? subcomponentClassName
                          : "tw-px-2"
                      )}
                      onClick={() => {
                        if (!!onRowClick) {
                          onRowClick(row.original);
                          setSelectedRowIndex(row.index);
                        }
                      }}
                      style={style}
                    >
                      {row.cells.map((cell) => {
                        let col = cell.column as any;
                        return (
                          <TdComponent
                            {...cell.getCellProps()}
                            className={cx("tw-py-2 tw-pl-2  tw-pr-2", {
                              "tw-my-auto": centerCells,
                              "tw-bg-secondary":
                                subRowBackground && cell.column.Header === "",
                              "tw-text-center": col.align === "center",
                              "tw-text-left":
                                col.align === "left" ||
                                undefined ||
                                col.align === "",
                              "tw-text-right": col.align === "right",
                            })}
                          >
                            {cell.render("Cell")}
                          </TdComponent>
                        );
                      })}
                    </TrComponent>
                    {row.isExpanded && renderRowSubComponent ? (
                      <TrComponent
                        {...row.getRowProps()}
                        key={`expanded-${row.getRowProps().key}`}
                        className="react-table-row tw-border-0 !tw-block tw-border-b tw-border-solid tw-border-slate-75 tw-px-2 tw-expanded"
                      >
                        <TdComponent colSpan={visibleColumns.length}>
                          {renderRowSubComponent({ row })}
                        </TdComponent>
                      </TrComponent>
                    ) : null}
                  </Fragment>
                );
              })}
            </TbodyComponent>
          </If>
        </TableComponent>

        {enablePagination && !isLoading && (
          <PaginationComponent
            gotoPage={gotoPage}
            previousPage={previousPage}
            pageSize={pageSize}
            nextPage={nextPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            setPageSize={setPageSize}
            totalSize={rows.length}
            forceResetRowSelection={forceResetRowSelection}
          />
        )}
      </div>
    );
  }
);

export default memo(Table);
