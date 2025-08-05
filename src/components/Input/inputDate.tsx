import { useState } from "react";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-gray-900"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
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
