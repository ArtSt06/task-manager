import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import { useDebounce } from "@hooks/useDebounce";

import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@shared/constants";

import CustomSelect from "@components/common/CustomSelect";

import "./TaskFilters.scss";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    priority?: string;
    search?: string;
  }) => void;
  filters: { status?: string; priority?: string; search?: string };
}

const statusOptions = [
  { value: "", label: "Все статусы" },
  ...STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

const priorityOptions = [
  { value: "", label: "Все приоритеты" },
  ...PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  })),
];

const TaskFilters = ({ onFilterChange, filters }: TaskFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const { debounced } = useDebounce((value: string) => {
    onFilterChange({ ...filtersRef.current, search: value || undefined });
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debounced(value);
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({ ...filters, status: val || undefined });
  };

  const handlePriorityChange = (val: string) => {
    onFilterChange({ ...filters, priority: val || undefined });
  };

  return (
    <div className="task-filters">
      <div className="task-filters-search">
        <FaSearch className="search-icon" />

        <input
          id="search"
          type="text"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      <div className="task-filters-selects">
        <CustomSelect
          id="statusFilter"
          value={filters.status || ""}
          onChange={handleStatusChange}
          options={statusOptions}
          className="filter-select"
        />

        <CustomSelect
          id="priorityFilter"
          value={filters.priority || ""}
          onChange={handlePriorityChange}
          options={priorityOptions}
          className="filter-select"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
