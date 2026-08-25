import { useNavigate } from "react-router";
import type { Element } from "../data/elements";

interface Props {
  element: Element;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  dimmed?: boolean;
}

export default function ElementCard({ element, size = "md", selected = false, dimmed = false }: Props) {
  const navigate = useNavigate();
  const catClass = `cat-${element.category}`;

  const sizes = {
    sm: "w-12 h-14 text-[9px]",
    md: "w-14 h-16 text-[10px]",
    lg: "w-16 h-[4.5rem] text-xs",
  };

  return (
    <button
      onClick={() => navigate(`/elemento/${element.number}`)}
      className={`
        ${sizes[size]} relative flex flex-col items-center justify-center rounded-lg border
        transition-all duration-150 cursor-pointer group
        ${catClass}
        ${selected ? "ring-2 ring-blue-500 scale-105 shadow-lg" : ""}
        ${dimmed ? "opacity-25 pointer-events-none" : "hover:scale-105 hover:shadow-md hover:z-10"}
      `}
      style={{
        background: "var(--cat-bg)",
        borderColor: "var(--cat-border)",
      }}
      title={element.name}
    >
      <span
        className="font-mono font-semibold leading-none mb-0.5"
        style={{ color: "var(--cat-text)", fontSize: size === "sm" ? "8px" : "9px" }}
      >
        {element.number}
      </span>
      <span
        className="font-bold leading-none"
        style={{
          color: "var(--cat-text)",
          fontSize: size === "sm" ? "14px" : size === "md" ? "17px" : "20px",
        }}
      >
        {element.symbol}
      </span>
      <span
        className="leading-none mt-0.5 truncate w-full text-center px-0.5"
        style={{ color: "var(--cat-text)", opacity: 0.8, fontSize: size === "sm" ? "7px" : "8px" }}
      >
        {element.name}
      </span>
      {size !== "sm" && (
        <span
          className="leading-none font-mono"
          style={{ color: "var(--cat-text)", opacity: 0.7, fontSize: "7px" }}
        >
          {element.mass.toFixed(1)}
        </span>
      )}
    </button>
  );
}
