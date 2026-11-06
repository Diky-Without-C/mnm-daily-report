/** Shapes shared by the filter / sort dropdowns of the Order and Sales cards. */
export type OptionItem = {
  label: string;
  value: string;
};

export type SingleField = {
  type: "single";
  selectedValue: string | null;
  options: OptionItem[];
};

export type MultipleField = {
  type: "multiple";
  selectedValue: string[];
  options: OptionItem[];
};

export type OrderOptionField = SingleField | MultipleField;
