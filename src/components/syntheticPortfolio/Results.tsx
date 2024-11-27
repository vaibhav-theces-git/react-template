import { MuiBox } from "src/common/components/box/MuiBox";
import ResultsDatacards from "./ResultsDatacards";
import ResultsDataTable from "./ResultsDataTable";

interface ResultProps {
  portfolioId: number;
  portfolioName: string;
}

const Results = (resultProps: ResultProps) => {
  const { portfolioId, portfolioName } = resultProps;
  return (
    <MuiBox>
      <MuiBox className="tw-mt-2">
        <ResultsDatacards portfolioId={portfolioId} />
      </MuiBox>
      <MuiBox className="tw-mt-2">
        <ResultsDataTable
          portfolioId={portfolioId}
          portfolioName={portfolioName}
        />
      </MuiBox>
    </MuiBox>
  );
};

export default Results;
