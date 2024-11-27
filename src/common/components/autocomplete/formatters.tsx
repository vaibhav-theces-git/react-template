import React, { HTMLAttributes } from "react";
import get from "lodash/get";
import CryptoIcon from "src/common/components/icon/CryptoIcon";

/**
 * Basic Autocomplete render option
 */
export const RenderBasicOption = (
  { className, ...props }: React.HTMLAttributes<HTMLLIElement>,
  option: { label: string; value: string | number }
) => {
  const { label, value } = option;

  return (
    <li {...props} key={value} className={`${className || ""} tw-break-all`}>
      {label}
    </li>
  );
};

export const RenderAssetOption = (
  { className, ...props }: React.HTMLAttributes<HTMLLIElement>,
  option: { label: string; value: string }
) => {
  const { label, value } = option;

  return (
    <li
      {...props}
      key={label}
      className={`${className || ""} tw-flex tw-break-all tw-items-center`}
    >
      <CryptoIcon token={value} />
      <div className="tw-ml-2">{label}</div>
    </li>
  );
};

export const RenderWhitelistOption = (
  { className, ...props }: React.HTMLAttributes<HTMLLIElement>,
  option: { label: string; value: string }
) => {
  const { label, value } = option;

  return (
    <li
      {...props}
      key={label}
      className={`${className || ""} tw-flex tw-break-all tw-items-center`}
    >
      <div className="tw-ml-2">
        {label} ({value})
      </div>
    </li>
  );
};

/**
 * if options are string[], direct label and value derived from autocompleteOption object
 * else this will consider label and value from the key
 * @param cryptoIconKey - lodash get key format supported
 * @returns
 */
export const RenderCryptoOption =
  (cryptoIconKey = "value") =>
  (props: HTMLAttributes<HTMLLIElement>, autocompleteOption: any) => {
    let label = "";
    let value = "";
    if (typeof autocompleteOption === "string") {
      label = autocompleteOption;
      value = autocompleteOption;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ({ label } = autocompleteOption);
      value = get(autocompleteOption, cryptoIconKey) as string;
    }
    return (
      <li {...props}>
        <div className="tw-flex tw-items-center tw-gap-2">
          {value && <CryptoIcon token={value} />}
          <div className="tw-mt-1">{label}</div>
        </div>
      </li>
    );
  };
