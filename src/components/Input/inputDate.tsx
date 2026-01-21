import { useState } from "react";
import Calendar from "@components/icon/Calendar";

interface InputDateProps {
  onDateChange: (date: Date) => void;
}

export default function InputDate({ onDateChange }: InputDateProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isShow, setIsShow] = useState(false);

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

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1,
  );

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handleClick = (day: number) => {
    setSelectedDay(day);
    setIsShow(false);
    onDateChange(new Date(year, month, day));
  };

  return (
    <section className="relative flex w-1/5 flex-col items-center rounded-xl bg-red-400 px-4 py-2 shadow-lg">
      <h1 className="mb-2 text-lg font-semibold text-white">Date</h1>
      <button
        onClick={() => {
          setIsShow(true);
        }}
        className="flex h-10 w-full cursor-pointer justify-center rounded border border-gray-300 bg-white/80 p-2"
      >
        <Calendar />
      </button>

      <main
        className={`${isShow ? "block" : "hidden"} absolute top-0 right-0 z-10 w-54 rounded-lg bg-slate-50 p-2 font-mono shadow-lg`}
      >
        <h1 className="mb-3 text-center font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h1>

        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-sm text-gray-600">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
          {days.map((day) => (
            <div
              key={day}
              onClick={() => handleClick(day)}
              className={`cursor-pointer rounded-full py-1 text-center ${
                selectedDay === day
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </main>
    </section>
  );
}
