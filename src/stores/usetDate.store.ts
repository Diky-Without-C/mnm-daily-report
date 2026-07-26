import { create } from "zustand";

type DateState = {
  date: Date;
  setDate: (value: Date | ((prev: Date) => Date)) => void;
};

export const useDateStore = create<DateState>((set) => ({
  date: new Date(),

  setDate: (value) =>
    set((state) => ({
      date: typeof value === "function" ? value(state.date) : value,
    })),
}));
