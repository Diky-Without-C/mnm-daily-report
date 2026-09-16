import { useMemo, useState, type InputHTMLAttributes } from "react";
import InputText from "../InputText";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";

interface AutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
}

export default function Autocomplete({
  options,
  value = "",
  id,
  onChange,
  invalid,
  disabled,
  ...props
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, value]);

  return (
    <Dropdown open={open} onOpenChange={setOpen} closeOnSelect>
      <DropdownTrigger toggle={false} asChild>
        <InputText
          id={id}
          value={value}
          invalid={invalid}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange?.(e.target.value);
            setOpen(true);
          }}
          {...props}
        />
      </DropdownTrigger>

      {open && filteredOptions.length > 0 && (
        <DropdownContent className="max-h-56 w-full">
          {filteredOptions.map((option) => (
            <DropdownItem
              key={option}
              onClick={() => {
                onChange?.(option);
              }}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </Dropdown>
  );
}
