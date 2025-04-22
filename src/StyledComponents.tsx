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
};

export function StyledInput({
  label,
  value,
  setValue,
  type = "text",
}: StyledInputProps) {
  return (
    <label className="w-128 flex flex-row justify-between">
      {label}:
      <div className="w-90">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={type}
          className="border rounded border-gray-400 ml-2 px-1"
        ></input>
      </div>
    </label>
  );
}
