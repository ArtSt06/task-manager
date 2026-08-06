import { useState, useRef, useEffect } from "react";
import "./CustomSelect.scss";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  id?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  id = "",
  className = "",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find((option) => option.value === value)?.label;

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`custom-select ${className} ${disabled ? "disabled" : ""}`}
      ref={containerRef}
    >
      <select id={id} className="hidden-select"></select>
      <div
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleOpen();
          }
        }}
      >
        <span className="custom-select-value">{currentLabel}</span>
      </div>

      {isOpen && !disabled && (
        <ul className="custom-select-options" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={option.value === value ? "active" : ""}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
