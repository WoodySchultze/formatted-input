import React, { useEffect, useState, useRef } from "react";
import { repositionCursor } from "./utils/repositionCursor";
import { toast } from "react-toastify";
import { ReactComponent as ThumbsUpIcon } from "../assets/svg/thumbsUp.svg";
import { ReactComponent as WarningIcon } from "../assets/svg/warningSign.svg";

interface InputProps {
  formatType: "currency" | "phoneNumber";
  groupSeparator: "," | "-";
  emit: (cleanValue: string, number: number, formattedValue: string, valid: boolean, errorMsg: string) => void;
}

interface InputState {
  cleanValue: string;
  number: number;
  formattedValue: string;
  valid: boolean;
  errorMsg: string;
}

export default function FormattedInput({ formatType, groupSeparator, emit }: InputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputState, setInputState] = useState<InputState>({
    cleanValue: "",
    number: 0,
    formattedValue: "",
    valid: false,
    errorMsg: "",
  });
  const [cursorPosition, setCursorPosition] = useState(0);
  const [lastKeyDown, setLastKeyDown] = useState("");

  if (formatType !== "currency" && formatType !== "phoneNumber") {
    throw new Error("formatType prop must be 'currency' or 'phoneNumber' ");
  }

  /**
   * Prevent cursor jumping white editing input
   */
  useEffect(() => {
    if (inputRef === null) return;
    if (inputRef.current === null) return;
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  /**
   * Prevent the enter key from triggering default behavior
   * (form submission), then setLastKeyDown
   * @param e React.KeyboardEvent
   */
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    setLastKeyDown(e.key);
  };

  /**
   * Clean all non numeric values from input
   * @param text Input
   * @returns A string of only numbers
   */
  const clean = (text: string): string => {
    return text.replaceAll(/[^\d]/g, "");
  };

  /**
   * Format a string value containing only numeric characters.
   * @param value string of the form "1234567890"
   * @returns string of the form "$1,234,567,890" or "123-456-7890"
   */
  const format = (value: string): string => {
    let formatted: string = "";

    /**
     * Format currency
     */
    if (formatType === "currency") {
      // return new Intl.NumberFormat().format(Number(value)); // No prefix format
      formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Number(value));

      /**
       * Format phone number
       */
    } else if (formatType === "phoneNumber") {
      const len = value.length;

      if (value === "") {
        formatted = "";
      } else if (len < 4 && len > 0) {
        formatted = value;
      } else if (len >= 4 && len < 7) {
        formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
      } else if (len >= 7 && len <= 10) {
        formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
      } else if (len > 10) {
        toast.error("Phone number can only be 10 digits!");
        throw new Error("Phone number can only be 10 digits");
      }
    }
    return formatted;
  };

  /**
   * Given a string value containing only numeric characters, based
   * on the formatType prop (currency/phoneNumber), validate the value.
   * @param value String with only numeric characters (e.g. "1234567890")
   * @returns true/false
   */
  const validate = (value: string): boolean => {
    /**
     * Validate currency
     */
    if (formatType === "currency" && Number(value) >= 1) {
      return true;
    } else if (formatType === "currency" && Number(value) < 1) {
      return false;

      /**
       * Validate phone number
       */
    } else if (formatType === "phoneNumber" && value.length === 10) {
      return true;
    } else if (formatType === "phoneNumber" && value.length !== 10) {
      return false;
    } else {
      throw new Error(`Something went wrong during ${formatType} validation`);
    }
  };

  /**
   * Given a string value containing only numeric characters, based
   * on the formatType prop ("currency"/"phoneNumber"), return an
   * error message
   * @param value cleaned string of only numbers (e.g. "1234567890")
   * @returns string
   */
  const getErrorMsg = (): string => {
    /**
     * Get currency errorMsg
     */
    if (formatType === "currency" && inputState.valid === true) {
      return "";
    } else if (formatType === "currency" && inputState.valid === false) {
      return "Price must be at least $1";

      /**
       * Get phone number errorMsg
       */
    } else if (formatType === "phoneNumber" && inputState.valid === true) {
      return "";
    } else if (formatType === "phoneNumber" && inputState.valid === false) {
      return "Phone number must be 10 digits";
    } else {
      throw new Error(`Something went wrong during ${formatType} validation`);
    }
  };

  /**
   * Handle component state and emit state to parent component when changes to input are made.
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value, selectionStart },
    } = e;

    if (value === "") {
      emit("", 0, "", false, "");
      setInputState((s) => ({
        ...s,
        cleanValue: "",
        number: 0,
        formattedValue: "",
        valid: false,
        errorMsg: "",
      }));
    } else if (value.length >= 1) {
      //Prevent cursor jumping on "Backspace" and "Delete"
      const { modifiedValue, modifiedCursorPosition } = repositionCursor({
        eventTargetValue: e.target.value, // <------ must be current value effected by change event
        formattedValueFromState: inputState.formattedValue, // <---- must be formattedValue currently in inputState
        lastKeyDown: lastKeyDown,
        selectionStart: selectionStart,
        groupSeparator: groupSeparator,
      });

      const cleanValue = clean(modifiedValue);
      const number = Number(cleanValue);
      const formattedCleanValue = format(cleanValue);
      const valid = validate(cleanValue);

      let prefix = "";
      if (formatType === "currency") {
        prefix = "$";
      }

      // Prevent cursor jumping when formatting applies a groupSeparator and or prefix
      if (modifiedCursorPosition !== undefined && modifiedCursorPosition !== null) {
        let newCursor = modifiedCursorPosition + (formattedCleanValue.length - value.length);
        newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;
        setCursorPosition(newCursor);
      }

      setInputState({
        cleanValue: cleanValue,
        number: number,
        formattedValue: formattedCleanValue === "$0" ? "" : formattedCleanValue,
        valid: valid,
        errorMsg: "", // <--- errorMsg is set by handleBlur, typing input will hide errorMsg
      });
      emit(cleanValue, number, formattedCleanValue, valid, "");
    }
  };

  /**
   * Set errorMsg to inputState onBlur and emit inputState to parent
   */
  const handleBlur = (): void => {
    const message = getErrorMsg();
    setInputState((s) => ({
      ...s,
      errorMsg: message,
    }));
    emit(inputState.cleanValue, inputState.number, inputState.formattedValue, inputState.valid, message);
  };

  return (
    <div className="formatted-input">
      <div className={`formatted-input__value-wrap ${inputState.errorMsg.length > 0 ? "invalid" : ""}`}>
        <input
          placeholder={formatType === "currency" ? "$12,345" : formatType === "phoneNumber" ? "123-456-7890" : ""}
          style={{ background: "black", height: "3rem", fontSize: "2rem", color: "white" }}
          className={`formatted-input__value`}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type="text"
          value={inputState.formattedValue} // <-- inputState.formattedValue must be passed to repositionCursor
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {inputState.valid === true ? <ThumbsUpIcon className="formatted-input__value__svg" /> : null}
      </div>
      {inputState.errorMsg.length > 0 ? (
        <div className="formatted-input__error-msg">
          <WarningIcon className="formatted-input__error-msg__svg" /> {inputState.errorMsg}
        </div>
      ) : null}
    </div>
  );
}
