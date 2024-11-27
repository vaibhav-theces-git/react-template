import { MuiBox } from "src/common/components/box/MuiBox";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { noDataMessage } from "src/common/constants/testids";
import { HistogramResponseType, PnlResponseType } from "src/types/pnlTypes";
import ProfitLossVector from "./ProfitLossVector";

export interface AgGridRowDetailPopupData {
  isModalOpen: boolean;
  handleModal: () => void;
  pnlVectorData: PnlResponseType[];
  histogramData: HistogramResponseType[];
}

const AgGridRowDetailPopup = (
  agGridRowDetailPopupData: AgGridRowDetailPopupData
) => {
  const { isModalOpen, handleModal, pnlVectorData, histogramData } =
    agGridRowDetailPopupData;
  return (
    <CustomModal
      isOpen={isModalOpen}
      handleClose={handleModal}
      title={<MuiBox> PnL Vector </MuiBox>}
      maxWidth="lg"
      classNames="custommodal"
    >
      {pnlVectorData &&
      pnlVectorData.length > 0 &&
      histogramData &&
      histogramData.length > 0 ? (
        <ProfitLossVector
          pnlData={pnlVectorData}
          histogramData={histogramData}
        />
      ) : (
        <MuiTypography className="tw-text-center tw-text-sm tw-m-6 tw-text-white">
          {noDataMessage}
        </MuiTypography>
      )}
    </CustomModal>
  );
};

export default AgGridRowDetailPopup;
