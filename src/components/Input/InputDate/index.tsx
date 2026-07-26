import { useState } from "react";
import Calendar from "@components/Icons/Calendar";
import ChevronUp from "@components/Icons/ChevronUp";
import Button from "@components/Buttons";
import { useClickOutside } from "@hooks/useClickOutside";
import { cn } from "@utils/cn";

interface InputDateProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const monthNames = [
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

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export default function InputDate({ date, onDateChange }: InputDateProps) {
  const today = new Date(date);
  const year = today.getFullYear();
  const [month, setMonth] = useState(today.getMonth());

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isOpen, setIsOpen] = useState(false);

  const { ref } = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    onClickOutside: () => setIsOpen(false),
  });

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1,
  );

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setIsOpen(false);
    onDateChange(new Date(year, month, day));
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    onDateChange(new Date(year, newMonth, selectedDay));
  };

  return (
    <div ref={ref} className="relative">
      <Button onClick={() => setIsOpen((prev) => !prev)} className="p-1.5">
        <Calendar />
      </Button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="relative mb-3 flex items-center justify-between">
            <h2 className="text-center text-sm font-semibold text-gray-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-1">
              <Button
                onClick={() => handleMonthChange(month === 0 ? 11 : month - 1)}
                className="p-1"
              >
                <ChevronUp />
              </Button>
              <Button
                onClick={() => handleMonthChange(month === 11 ? 0 : month + 1)}
                className="p-1"
              >
                <ChevronUp className="rotate-180" />
              </Button>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-7 text-center text-xs text-gray-400">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={cn(
                  "rounded-lg p-1 transition",
                  selectedDay === day
                    ? "bg-blue-400 text-white hover:bg-blue-500"
                    : "hover:bg-blue-100",
                  day === new Date().getDate() && "border border-blue-500",
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
