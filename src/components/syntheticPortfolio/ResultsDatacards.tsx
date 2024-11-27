import { Chip, SelectChangeEvent, Stack } from "@mui/material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { useEffect, useState } from "react";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import AddIcon from "@mui/icons-material/Add";
import { Cancel } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { MuiCard } from "src/common/components/card/MuiCards/MuiCard";
import { MuiCardContent } from "src/common/components/card/MuiCards/MuiCardContent";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { errorPrefix } from "src/common/constants/testids";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { MenuProps } from "src/common/utilities/ValidationUtils/batchConfigConstants";
import {
  useLazyGetDatacardsQuery,
  useLazyUpdateDataCardsQuery,
} from "src/queries/portfolioSetupApi";
import { ErrorType } from "src/types/apiErrorTypes";
import { DynamicCardRequestType } from "src/types/datacardTypes";
import {
  dataCardsRequestType,
  dataCardsResponseType,
} from "src/types/syntheticPortfolioTypes";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiGrid from "src/common/components/grid/MuiGrid";

interface ResultsDatacardsProps {
  portfolioId: number;
}

const ResultsDatacards = (props: ResultsDatacardsProps) => {
  const { portfolioId } = props;
  const [showSettings, setShowSettings] = useState(false);
  const [dynamicCardsdata, setDynamicCardsdata] = useState<
    dataCardsResponseType[]
  >([]);
  const [selectedCards, setSelectedCards] = useState<DynamicCardRequestType[]>(
    []
  );
  const [tempSelectedCards, setTempSelectedCards] = useState<
    DynamicCardRequestType[]
  >([]);
  const [dataCardsTrigger] = useLazyGetDatacardsQuery();
  const [updatedataCardsTrigger] = useLazyUpdateDataCardsQuery();

  const getDataCards = () => {
    const dataCardsParams: dataCardsRequestType = {
      portfolio_id: portfolioId,
    };
    dataCardsTrigger(dataCardsParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: dataCardsResponseType[] | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled" && d.data !== undefined) {
          const responseData = d.data;
          const selectedCardsData = responseData
            .filter((name) => name.isSelected)
            .map((name) => name.title as unknown as dataCardsResponseType);
          setDynamicCardsdata(responseData);
          setSelectedCards(selectedCardsData);
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

  const onCardsSelectionSave = (selectedCardsData: DynamicCardRequestType) => {
    updatedataCardsTrigger(selectedCardsData)
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
          getDataCards();
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

  const handleCardSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleCardSelection = (e: SelectChangeEvent<unknown>) => {
    const selectedValue = e.target.value as DynamicCardRequestType[];
    setSelectedCards(selectedValue);
  };

  const handleSubmit = () => {
    if (selectedCards.length >= 8) {
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
      SnackBarUtils.warning("Please Select 8 cards", snackbarOption);
    }
  };

  const handleCancel = () => {
    setShowSettings(false);
    setSelectedCards(tempSelectedCards);
  };

  useEffect(() => {
    if (showSettings) {
      setTempSelectedCards(selectedCards);
    }
  }, [showSettings]); // eslint-disable-line

  useEffect(() => {
    getDataCards();
  }, [portfolioId]); // eslint-disable-line

  return (
    <>
      <MuiGrid
        item
        className="tw-grow-0 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-space-x-6 tw-bg-slate-50 tw-relative tw-h-32"
      >
        <MuiBox className="tw-grid lg:tw-grid-cols-8 md:tw-grid-cols-8 sm:tw-grid-cols-4 xs:tw-grid-cols-4 tw-gap-px tw-h-full tw-w-full">
          {dynamicCardsdata.map(
            (card: dataCardsResponseType) =>
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
        </MuiBox>
      </MuiGrid>
      <CustomModal
        isOpen={showSettings}
        handleClose={handleCancel}
        title={
          selectedCards.length === 8
            ? "Select Cards [Maximum 8 cards can be selected]"
            : "Select Cards"
        }
        classNames="tw-p-0"
        headerClassName="tw-text-sm tw-font-bold"
        maxWidth="lg"
      >
        <MuiBox className="tw-grid tw-grid-cols-2  tw-mt-3 tw-w-80 tw-h-40">
          <MuiSelect
            multiple
            value={selectedCards}
            onChange={handleCardSelection}
            className="tw-w-80"
            sx={{
              height: "200px",
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
            {dynamicCardsdata.map((listitems: dataCardsResponseType) => (
              <MuiMenuItem
                key={listitems.seq_number}
                value={listitems.title}
                sx={{
                  justifyContent: "space-between",
                }}
                disabled={
                  selectedCards.length >= 8 &&
                  !selectedCards.includes(
                    listitems.title as unknown as dataCardsResponseType
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
        <MuiBox className="tw-flex tw-justify-end tw-mt-11 tw-pr-1">
          <MuiButton
            type="submit"
            onClick={handleSubmit}
            className="tw-bg-slate-75"
          >
            Submit
          </MuiButton>
        </MuiBox>
      </CustomModal>
    </>
  );
};

export default ResultsDatacards;
