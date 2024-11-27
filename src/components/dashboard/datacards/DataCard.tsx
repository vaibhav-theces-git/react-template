import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiCard } from "src/common/components/card/MuiCards/MuiCard";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiCardContent } from "src/common/components/card/MuiCards/MuiCardContent";
import {
  DataCardResponseType,
  DynamicCardRequestType,
} from "src/types/datacardTypes";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import MuiSelect from "src/common/components/select/MuiSelect";
import { Chip, SelectChangeEvent, Stack } from "@mui/material";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { useLazyUpdateDataCardConfigurationQuery } from "src/queries/dynamicCardsApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import { Cancel } from "@mui/icons-material";

export interface DataCardProps {
  dynamicCardsdata: DataCardResponseType[];
  getDataCardsData: () => void;
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};
const Card = (props: DataCardProps) => {
  const { dynamicCardsdata, getDataCardsData } = props;

  const [showSettings, setShowSettings] = useState(false);
  const [selectedCards, setSelectedCards] = useState<DynamicCardRequestType[]>(
    dynamicCardsdata
      .filter((name) => name.isSelected)
      .map((name) => name.title as unknown as DynamicCardRequestType)
  );
  const [tempSelectedCards, setTempSelectedCards] = useState<
    DynamicCardRequestType[]
  >([]);

  const [dynamicCardsDataTrigger] = useLazyUpdateDataCardConfigurationQuery();

  useEffect(() => {
    if (showSettings) {
      setTempSelectedCards(selectedCards);
    }
  }, [showSettings]); // eslint-disable-line

  const handleCardSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleCardSelection = (e: SelectChangeEvent<unknown>) => {
    const selectedValue = e.target.value as DynamicCardRequestType[];
    setSelectedCards(selectedValue);
  };

  const onCardsSelectionSave = (selectedCardsData: DynamicCardRequestType) => {
    dynamicCardsDataTrigger(selectedCardsData)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: void | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          getDataCardsData();
          SnackBarUtils.success("Cards updated successfully ", snackbarOption);
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };

  const handleSubmit = () => {
    if (selectedCards.length >= 4) {
      const selectedCardsData = JSON.stringify(
        selectedCards.map((selectedTitle) => {
          const selectedCard = dynamicCardsdata.find(
            (card: DynamicCardRequestType) =>
              card.title === (selectedTitle as unknown)
          );
          return selectedCard;
        }),
        ["cardId"]
      );
      setShowSettings(!showSettings);
      onCardsSelectionSave(JSON.parse(selectedCardsData));
    } else {
      SnackBarUtils.warning("Please Select 4 cards", snackbarOption);
    }
  };

  const handleCancel = () => {
    setShowSettings(false);
    setSelectedCards(tempSelectedCards);
  };

  return (
    <MuiBox className="tw-grid lg:tw-grid-cols-4 md:tw-grid-cols-4 sm:tw-grid-cols-2 xs:tw-grid-cols-2 tw-gap-px tw-h-full tw-w-full">
      {dynamicCardsdata.map(
        (card: DataCardResponseType) =>
          card.isSelected && (
            <MuiCard
              className={`tw-w-36.5 tw-flex tw-items-center tw-justify-center`}
              key={card.title}
              style={{ backgroundColor: card.backgroundColor }}
            >
              <MuiCardContent
                sx={{
                  padding: 0,
                  "&:last-child": {
                    paddingBottom: 0,
                  },
                }}
              >
                <MuiTypography
                  variant="h5"
                  className="tw-text-gray-300 tw-text-center tw-leading-9"
                >
                  {card.title}
                </MuiTypography>
                <MuiTypography className="tw-text-white tw-text-3xl tw-text-center tw-font-bold tw-leading-8 ">
                  {card.value}
                </MuiTypography>
              </MuiCardContent>
            </MuiCard>
          )
      )}
      <MuiIconButton
        size="small"
        className="tw-h-7 tw-bg-slate-100 tw-w-7 tw-absolute tw-top-0 tw-right-0"
        onClick={handleCardSettings}
      >
        <AddIcon />
      </MuiIconButton>
      <CustomModal
        isOpen={showSettings}
        handleClose={handleCancel}
        title={
          selectedCards.length === 4
            ? "Select Cards [Maximum 4 cards can be selected]"
            : "Select Cards"
        }
        classNames="tw-p-0"
        headerClassName="tw-text-sm tw-font-bold"
      >
        <MuiBox className="tw-grid tw-grid-cols-2  tw-mt-3 tw-w-80 tw-h-12">
          <MuiSelect
            multiple
            value={selectedCards}
            onChange={handleCardSelection}
            className="tw-w-80"
            sx={{
              height: "100px",
            }}
            renderValue={() => (
              <Stack
                gap={1}
                direction="row"
                flexWrap="wrap"
                className=" tw-mt-1  tw-text-sm tw-overflow-auto"
              >
                {selectedCards.map((value: any) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() =>
                      setSelectedCards(
                        selectedCards.filter((item) => item !== value)
                      )
                    }
                    deleteIcon={
                      <Cancel
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    }
                  />
                ))}
              </Stack>
            )}
            MenuProps={MenuProps}
          >
            {dynamicCardsdata.map((listitems: DataCardResponseType) => (
              <MuiMenuItem
                key={listitems.seq_number}
                value={listitems.title}
                sx={{
                  justifyContent: "space-between",
                }}
                disabled={
                  selectedCards.length >= 4 &&
                  !selectedCards.includes(
                    listitems.title as unknown as DataCardResponseType
                  )
                }
              >
                {listitems.title}
                {selectedCards.includes(
                  listitems.cardId as unknown as DynamicCardRequestType
                ) && <CheckIcon color="info" />}
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </MuiBox>
        <MuiBox className="tw-flex tw-justify-end tw-mt-14">
          <MuiButton
            type="submit"
            onClick={handleSubmit}
            className="tw-bg-slate-75"
          >
            Submit
          </MuiButton>
        </MuiBox>
      </CustomModal>
    </MuiBox>
  );
};
export default Card;
