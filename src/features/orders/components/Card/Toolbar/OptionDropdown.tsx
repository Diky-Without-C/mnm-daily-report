import type { ReactNode } from "react";
import Button from "@components/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@components/Dropdown";
import CheckBox from "@components/Input/CheckBox";
import RadioBox from "@components/Input/RadioBox";
import type { OrderOptionField } from "@constants/Order";

interface OptionDropdownProps {
  options: Record<string, OrderOptionField>;
  label: string;
  icon: ReactNode;
  onChange: (group: string, value: OrderOptionField["selectedValue"]) => void;
}

export default function OptionDropdown({
  options,
  label,
  icon,
  onChange,
}: OptionDropdownProps) {
  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger asChild>
        <Button className="px-3 py-1.5">
          {icon}
          {label}
        </Button>
      </DropdownTrigger>

      <DropdownContent className="max-h-[17rem] w-56 p-1.5">
        {Object.keys(options).map((group) => {
          const option = options[group];
          const isMultiple = option.type === "multiple";

          return (
            <div key={group}>
              <div className="px-2 pt-1 pb-1.5">
                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {group}
                </span>
              </div>
              <div className="space-y-0.5">
                {option.options.map((item) => {
                  const id = `filter-${group}${isMultiple ? `-${item.label}` : ""}`;
                  const checked = isMultiple
                    ? option.selectedValue.includes(item.value)
                    : option.selectedValue === item.value;

                  const handleChange = () => {
                    if (isMultiple) {
                      const selected = new Set(option.selectedValue);

                      if (selected.has(item.value)) {
                        selected.delete(item.value);
                      } else {
                        selected.add(item.value);
                      }

                      onChange(group, Array.from(selected));
                    } else {
                      onChange(group, item.value);
                    }
                  };

                  return (
                    <DropdownItem
                      key={item.label}
                      className="px-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleChange();
                      }}
                    >
                      <label
                        htmlFor={id}
                        className="flex w-full cursor-pointer items-center gap-2 uppercase"
                      >
                        {isMultiple ? (
                          <CheckBox
                            id={id}
                            checked={checked}
                            onChange={handleChange}
                          />
                        ) : (
                          <RadioBox
                            id={id}
                            checked={checked}
                            onChange={handleChange}
                          />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </label>
                    </DropdownItem>
                  );
                })}
              </div>
            </div>
          );
        })}
      </DropdownContent>
    </Dropdown>
  );
}
