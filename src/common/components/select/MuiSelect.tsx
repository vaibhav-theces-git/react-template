import Select, { SelectProps } from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";

const StyledSelect = styled(Select)`
  font-family: inherit;
  background-color: #4f566b;
  color: white;
  padding-top: 8.5px;
  padding-bottom: 8.5px;
  height: 1.4375em;
  text-align: right;
  margin-right: 3px;

  .MuiSelect-icon {
    height: 20px;
    margin-top: 3px;
  }
`;

const AlternateStyledSelect = styled(Select)`
  font-family: inherit;
  background: unset;
  color: white;
  padding-top: 8.5px;
  padding-bottom: 8.5px;
  height: 1.4375em;
  text-align: left;

  .MuiSelect-icon {
    height: 20px;
    margin-top: 3px;
  }
`;

const MuiSelect: React.FC<SelectProps> = (props: SelectProps) => (
  <StyledSelect IconComponent={KeyboardArrowDownIcon} {...props} />
);

export default MuiSelect;

export const MuiAlternateSelect: React.FC<SelectProps> = (
  props: SelectProps
) => <AlternateStyledSelect IconComponent={KeyboardArrowDownIcon} {...props} />;
