// By default, it wont round off due to default options
export const formatToLocale = (
  num: number,
  locale = "en-US",
  opts = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  }
) => Intl.NumberFormat(locale, opts).format(num);

export const toDecimalNumber = (
  numberString: string | number,
  digitsAfterDecimal: number
) => {
  if (numberString) {
    const numval = parseFloat(numberString.toString()).toFixed(
      digitsAfterDecimal
    );
    const floatNum = parseFloat(numval).toLocaleString("en-US");
    return floatNum;
  }
  return numberString;
};
