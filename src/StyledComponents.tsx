type StyledButtonProps = {
  displayText: string;
  onClick: () => void;
  disabled?: boolean;
  colour?: "blue" | "red";
};

export function StyledButton({
  displayText,
  onClick,
  disabled = false,
  colour = "blue",
}: StyledButtonProps) {
  const colours = {
    blue: `bg-blue-500 hover:bg-blue-700`,
    red: `bg-red-500 hover:bg-red-700`,
  };

  return (
    <button
      className={
        colours[colour] +
        " text-white font-bold py-2 px-4 mr-4 rounded disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 cursor-pointer disabled:cursor-auto"
      }
      disabled={disabled}
      onClick={onClick}
    >
      {displayText}
    </button>
  );
}

type StyledInputProps = {
  label: string;
  value: any;
  setValue: (value: string) => void;
  type?: "text" | "date" | "time" | "number";
  flexDirection?: "row" | "col";
};

const InputTypeToLabelWidths: Record<
  "text" | "date" | "time" | "number",
  string
> = {
  text: "max-w-128 flex-1",
  date: "w-min",
  time: "w-min",
  number: "w-16",
};

export function StyledInput({
  label,
  value,
  setValue,
  type = "text",
  flexDirection = "row",
}: StyledInputProps) {
  const labelClasses: string =
    flexDirection == "col" ? "w-max flex-col" : "w-full";
  const labelTextDivClass: string = flexDirection == "col" ? "w-max" : "w-36";
  const inputWidth: string = InputTypeToLabelWidths[type];

  return (
    <label className={labelClasses + " flex"}>
      <div className={labelTextDivClass + " text-right pr-2"}>{label}:</div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        className={inputWidth + " border rounded border-gray-400 px-1"}
      ></input>
    </label>
  );
}
