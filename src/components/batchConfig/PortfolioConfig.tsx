import React, { useCallback, useMemo } from "react";
import { Column } from "react-table";
import Table from "src/common/components/Table";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { LegalEntity } from "src/types/batchConfigurationTypes";

export type PortfolioConfigProps = {
  legelEntityData: LegalEntity[];
  editAccountsCallback: (row: LegalEntity) => void;
  onRowSelection: (row: LegalEntity) => void;
};

interface LegelEntityGridDataRow {
  row: {
    original: LegalEntity;
  };
}

const PortfolioConfig = (props: PortfolioConfigProps) => {
  const { legelEntityData, editAccountsCallback, onRowSelection } = props;
  const excludedAccountsTemplate = (data: LegelEntityGridDataRow) => (
    <span>
      {data?.row?.original?.excluded_accts.length > 0
        ? data?.row?.original?.excluded_accts?.map((acc) => acc?.name).join(",")
        : "None"}
    </span>
  );

  const editAccountsTemplate = useCallback(
    (data: LegelEntityGridDataRow) =>
      data && (
        <MuiButton
          className=" tw-bg-orange-800 tw-text-white tw-text-xs tw-font-normal tw-text-right"
          sx={{ minWidth: "32px", height: "20px" }}
          onClick={() => {
            editAccountsCallback(data.row.original);
          }}
        >
          Edit Acct Selection
        </MuiButton>
      ),
    [editAccountsCallback]
  );

  const portfolioColumns: Column<LegalEntity>[] = useMemo(
    () => [
      {
        Header: "Entity",
        accessor: "name",
        width: 90,
        align: "left",
      },
      {
        Header: "Accounts Excluded",
        accessor: "excluded_accts",
        width: 90,
        align: "left",
        Cell: excludedAccountsTemplate,
      },
      {
        id: "editAccountsColumn",
        width: 30,
        Cell: editAccountsTemplate,
      },
    ],
    [editAccountsTemplate]
  );

  return (
    <MuiBox
      className="tw-h-36 tw-overflow-auto"
      sx={{ border: 1, borderColor: "#1E2435" }}
    >
      <Table
        columns={portfolioColumns}
        data={legelEntityData}
        enablePagination={false}
        enableRowSelection
        onRowClick={(row: any) => {
          onRowSelection(row);
        }}
        noDataTableClasses="nodatatext-left"
        noDataTableMessage="Use + button to add entity."
      />
    </MuiBox>
  );
};

export default PortfolioConfig;
