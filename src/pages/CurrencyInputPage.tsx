import React, { useState } from "react";
import FormattedInput from "../components/FormattedInput";
import { Link } from "react-router-dom";

interface CurrencyInputPageState {
  kind: string;
  value: string;
  number: number;
  formatted: string;
  valid: boolean;
  errorMsg: string;
}

export default function CurrencyInputPage() {
  const [currencyState, setCurrencyState] = useState<CurrencyInputPageState>({
    kind: "currency",
    value: "",
    number: 0,
    formatted: "",
    valid: false,
    errorMsg: "",
  });
  return (
    <div className="page-wrap">
      <Link className="page-link" to={"/"}>
        Back to Home
      </Link>
      <div>
        <label>Currency Input</label>
        <FormattedInput
          formatType="currency"
          groupSeparator=","
          emit={(value, number, formatted, valid, errorMsg) =>
            setCurrencyState((s) => ({
              ...s,
              value: value,
              number: number,
              formatted: formatted,
              valid: valid,
              errorMsg: errorMsg,
            }))
          }
        />
      </div>
    </div>
  );
}
