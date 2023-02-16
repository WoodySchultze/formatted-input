import React, { useState } from "react";
import "./App.css";
import FormattedInput from "./components/FormattedInput";

interface AppState {
  kind: string;
  value: string;
  number: number;
  formatted: string;
  valid: boolean;
  errorMsg: string;
}

function App() {
  const [currencyState, setCurrencyState] = useState<AppState>({
    kind: "currency",
    value: "",
    number: 0,
    formatted: "",
    valid: false,
    errorMsg: "",
  });
  const [phoneNumberState, setPhoneNumberState] = useState<AppState>({
    kind: "phone number",
    value: "",
    number: 0,
    formatted: "",
    valid: false,
    errorMsg: "",
  });
  return (
    <div className="App">
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
      <br />
      <br />
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
  );
}

export default App;
