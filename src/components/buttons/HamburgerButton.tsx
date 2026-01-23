interface MenuButtonProps {
  open: boolean;
  onToggle: (open: boolean) => void;
}

export default function MenuButton({ open, onToggle }: MenuButtonProps) {
  function handleClick() {
    onToggle(!open);
  }

  return (
    <button
      type="button"
      aria-pressed={open}
      aria-label="Menu"
      onClick={handleClick}
      className="group inline-flex h-12 w-12 cursor-pointer items-center justify-center text-slate-800 transition"
    >
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="7"
          y="2"
          width="9"
          height="2"
          rx="1"
          className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:rotate-315 group-aria-pressed:[x:0] group-aria-pressed:[y:7]"
        />
        <rect
          y="7"
          width="16"
          height="2"
          rx="1"
          className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-pressed:rotate-45"
        />
        <rect
          y="12"
          width="9"
          height="2"
          rx="1"
          className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:rotate-135 group-aria-pressed:[x:0] group-aria-pressed:[y:7]"
        />
      </svg>
    </button>
  );
}
