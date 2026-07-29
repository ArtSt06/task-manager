import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import CustomSelect from "@components/common/CustomSelect";

import "./Header.scss";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: { status?: string; priority?: string }) => void;
  filters?: { status?: string; priority?: string };
}

const statusOptions = [
  { value: "", label: "Все статусы" },
  { value: "todo", label: "К выполнению" },
  { value: "inProgress", label: "В процессе" },
  { value: "done", label: "Выполнено" },
];

const priorityOptions = [
  { value: "", label: "Все приоритеты" },
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
];

const Header = ({
  onSearch = () => {},
  onFilterChange = () => {},
  filters = { status: "", priority: "" },
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>

      <div className="header-filters">
        <CustomSelect
          value={filters.status || ""}
          onChange={(val) =>
            onFilterChange({ ...filters, status: val || undefined })
          }
          options={statusOptions}
          className="filter-select"
        />

        <CustomSelect
          value={filters.priority || ""}
          onChange={(val) =>
            onFilterChange({ ...filters, priority: val || undefined })
          }
          options={priorityOptions}
          className="filter-select"
        />
      </div>
    </header>
  );
};

export default Header;
