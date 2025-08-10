interface SearchBarProps {
  mode: string;
  onSearch: (val: string) => void;
  onAdd: () => void;
}

export default function SearchBar({ mode, onSearch, onAdd }: SearchBarProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-xl font-semibold capitalize">{mode}</h1>
      <div className="flex gap-1">
        <div className="relative flex items-center">
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search here ..."
            className="h-9 rounded-lg border border-gray-900 bg-gray-50 pl-2 focus:border-blue-500 focus:outline-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-1 size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <button
          className="rounded-lg bg-blue-400 p-2 text-white hover:bg-blue-500"
          onClick={onAdd}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
