// This page came from:
// https://github.com/cchanxzy/react-currency-input-field/blob/master/src/components/utils/repositionCursor.ts

type RepositionCursorProps = {
  eventTargetValue: string;
  formattedValueFromState?: string;
  lastKeyDown: string | null;
  selectionStart?: number | null;
  groupSeparator?: string;
};

/**
 * Based on the last key stroke and the cursor position, update the eventTargetValue
 * and reposition the cursor to the right place
 */
export const repositionCursor = ({
  eventTargetValue,
  formattedValueFromState,
  selectionStart,
  lastKeyDown,
  groupSeparator,
}: RepositionCursorProps): {
  modifiedValue: string;
  modifiedCursorPosition: number | null | undefined;
} => {
  let modifiedCursorPosition = selectionStart;
  let modifiedValue = eventTargetValue;
  if (formattedValueFromState && modifiedCursorPosition) {
    const splitValue = eventTargetValue.split("");
    console.log("splitValue: ", splitValue);

    // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
    if (lastKeyDown === "Backspace" && formattedValueFromState[modifiedCursorPosition] === groupSeparator) {
      console.log("RIGHT");
      splitValue.splice(modifiedCursorPosition - 1, 1);
      modifiedCursorPosition -= 1;
    }

    // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
    if (lastKeyDown === "Delete" && formattedValueFromState[modifiedCursorPosition] === groupSeparator) {
      splitValue.splice(modifiedCursorPosition, 1);
      modifiedCursorPosition += 1;
    }

    modifiedValue = splitValue.join("");
    console.log("modifiedValue: ", modifiedValue);

    return { modifiedValue, modifiedCursorPosition };
  }

  return { modifiedValue, modifiedCursorPosition: selectionStart };
};
