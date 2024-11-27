/* eslint-disable */
export const getDynamicColumns = (obj: any) => {
  if (obj && obj.metadata) {
    const keys = Object.keys(obj.metadata);
    const metadata = obj.metadata || {};
    const metaDataArray: any[] = keys
      .map((x) => metadata[x])
      .sort((a, b) => {
        return a.column_sequence - b.column_sequence;
      });

    return metaDataArray
      .map((col) => {
        let columns;
        if (metaDataArray[0].column_sequence === col.column_sequence) {
          columns = {
            field: col.column_name,
            headerName: col.display_name,
            cellRenderer: "agGroupCellRenderer",
            cellDataType: col.datatype,
            resizable: true,
            minWidth: col.width,
            sortable: col.sort,
            unSortIcon: true,
            wrapHeaderText: true,
            type:
              col.alignment === "right" || col.datatype === "string"
                ? "numericColumn"
                : "",
          };
        } else {
          columns = {
            field: col.column_name,
            headerName: col.display_name,
            cellDataType: col.datatype,
            resizable: true,
            filter: true,
            minWidth: col.width,
            sortable: col.sort,
            unSortIcon: true,
            wrapHeaderText: true,
            type:
              col.alignment === "right" || col.datatype === "string"
                ? "numericColumn"
                : "",
          };
        }
        return columns;
      })
      .filter((col) => col != null);
  } else {
    return [];
  }
};
