import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

import Button from "@components/Button";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@utils/cn";

interface InputDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getDaysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function InputDate({ date, onDateChange }: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(date));

  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    onClickOutside: () => setIsOpen(false),
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
    [daysInMonth],
  );

  const changeMonth = (offset: number) => {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const selectDay = (day: number) => {
    const nextDate = new Date(year, month, day);

    onDateChange(nextDate);
    setViewDate(nextDate);
    setIsOpen(false);
  };

  const toggleCalendar = () => {
    if (!isOpen) {
      setViewDate(new Date(date));
    }

    setIsOpen((current) => !current);
  };

  return (
    <div ref={ref} className="relative">
      <Button onClick={toggleCalendar} className="p-2">
        <CalendarDaysIcon className="size-6" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          <CalendarHeader
            month={month}
            year={year}
            onPrevious={() => changeMonth(-1)}
            onNext={() => changeMonth(1)}
          />
          <div className="mb-2 grid grid-cols-7 text-center text-xs text-gray-400">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <span key={`empty-${index}`} aria-hidden="true" />
            ))}
            {days.map((day) => {
              const currentDate = new Date(year, month, day);
              const selected = isSameDay(currentDate, date);
              const today = isSameDay(currentDate, new Date());

              return (
                <Button
                  key={day}
                  variant={selected ? "info" : "default"}
                  onClick={() => selectDay(day)}
                  className={cn(
                    "flex aspect-square size-8 items-center justify-center rounded-lg p-0 transition",
                    today &&
                      !selected &&
                      "border border-blue-500 font-semibold text-blue-600",
                    selected && "font-bold",
                  )}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

function CalendarHeader({
  month,
  year,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <Button onClick={onPrevious} className="p-1">
        <ChevronLeftIcon className="size-4" />
      </Button>
      <span className="text-sm font-semibold text-gray-800">
        {MONTHS[month]} {year}
      </span>
      <Button onClick={onNext} className="p-1">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
