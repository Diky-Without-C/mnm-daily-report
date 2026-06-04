import { useState } from "react";
import Calendar from "@components/icon/Calendar";
import { useClickOutside } from "@/hooks/useClickOutside";

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
  const month = today.getMonth();

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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-100 shadow-sm hover:bg-gray-200"
      >
        <Calendar />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          <h2 className="mb-3 text-center text-sm font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>

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
                className={`rounded-lg py-1 transition ${
                  selectedDay === day
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100"
                } ${
                  day === new Date().getDate() ? "border border-blue-500" : ""
                }`}
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
