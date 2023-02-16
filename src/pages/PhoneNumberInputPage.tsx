import React, { useState } from "react";
import FormattedInput from "../components/FormattedInput";
import { Link } from "react-router-dom";

interface PhoneNumberInputPageState {
  kind: string;
  value: string;
  number: number;
  formatted: string;
  valid: boolean;
  errorMsg: string;
}

export default function PhoneNumberInputPage() {
  const [phoneNumberState, setPhoneNumberState] = useState<PhoneNumberInputPageState>({
    kind: "phone number",
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
        <label>Phone Number Input</label>
        <FormattedInput
          formatType="phoneNumber"
          groupSeparator="-"
          emit={(value, number, formatted, valid, errorMsg) =>
            setPhoneNumberState((s) => ({
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
