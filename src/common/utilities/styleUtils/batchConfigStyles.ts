export const entitySelectionTextBoxStyle = {
  paddingLeft: "5px",
  position: "sticky",
  top: 0,
  zIndex: 1,
  marginBottom: "10px",
  width: { sm: 200, md: 300 },
  "& .MuiInputBase-root": {
    height: 30,
  },
};

export const aggregationHierarchyTextFieldStyle = {
  paddingLeft: "5px",
  marginTop: "12px",
  width: "150px",
  "& .MuiInputBase-root": {
    height: 30,
  },
};

export const timePickerSlotProps = {
  textField: {
    inputProps: {
      style: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: "5px",
        fontSize: 10,
        height: "30px",
        width: "62px",
      },
    },
  },
};
export const primaryTypographyProps = {
  sx: { fontSize: "12px" },
};

export const datePickerProps = {
  textField: {
    inputProps: {
      style: {
        padding: 0,
        paddingLeft: 5,
        fontSize: 10,
        height: "30px",
        width: "62px",
      },
    },
  },
};

export const criticalBatchStyle = {
  padding: 0,
  margin: 0,
  "&.MuiCheckbox-root": {
    paddingLeft: "5px",
    paddingBottom: "30px",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
};

export const portfolioEditTextBoxStyle = {
  paddingLeft: "5px",
  position: "sticky",
  top: 0,
  zIndex: 1,
  width: { sm: 150, md: 150 },
  "& .MuiInputBase-root": {
    height: "30px",
  },
};
