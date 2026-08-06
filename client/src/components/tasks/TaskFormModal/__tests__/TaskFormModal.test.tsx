import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { createTestStore } from "@tests/helpers";

import useTaskForm from "@hooks/useTaskForm";

import TaskFormModal from "@components/tasks/TaskFormModal";

const mockDispatch = jest.fn();
jest.mock("@hooks/useTaskForm", () => jest.fn());
jest.mock("@store/reduxHooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(() => []),
}));

jest.mock("react-datepicker", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-datepicker" />,
  registerLocale: jest.fn(),
}));

jest.mock("@components/common/CustomSelect", () => ({
  __esModule: true,
  default: ({ value, options, onChange }) => (
    <select
      data-testid="custom-select"
      value={value}
      onChange={() => onChange?.(value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe("TaskFormModal", () => {
  const onClose = jest.fn();
  const mockHandleChange = jest.fn().mockReturnValue(jest.fn());
  const mockResetForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTaskForm as jest.Mock).mockReturnValue({
      formData: {
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: "",
      },
      isEdit: false,
      handleChange: mockHandleChange,
      getPayload: jest.fn(),
      isValid: jest.fn(() => true),
      resetForm: mockResetForm,
    });
  });

  it("renders modal when isOpen is true", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal isOpen={true} onClose={onClose} editingTaskId={null} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Создать задачу")).toBeInTheDocument();
    expect(screen.getByLabelText("Название")).toBeInTheDocument();
    expect(screen.getByLabelText("Описание")).toBeInTheDocument();
    expect(screen.getByLabelText("Дедлайн")).toBeInTheDocument();
    expect(screen.getByTestId("mock-datepicker")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal isOpen={false} onClose={onClose} editingTaskId={null} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByText("Создать задачу")).not.toBeInTheDocument();
  });

  it("renders in edit mode with correct title and data", () => {
    (useTaskForm as jest.Mock).mockReturnValue({
      formData: {
        title: "Task",
        description: "Description",
        priority: "high",
        status: "inProgress",
        deadline: "2025-02-01",
      },
      isEdit: true,
      handleChange: mockHandleChange,
      getPayload: jest.fn(),
      isValid: jest.fn(() => true),
      resetForm: mockResetForm,
    });

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal
            isOpen={true}
            onClose={onClose}
            editingTaskId="task-123"
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Редактировать задачу")).toBeInTheDocument();
    expect(screen.getByLabelText("Название")).toHaveValue("Task");
    expect(screen.getByLabelText("Описание")).toHaveValue("Description");
    expect(screen.getByText("01.02.2025")).toBeInTheDocument();
  });

  it("calls handleChange when typing in title", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal isOpen={true} onClose={onClose} editingTaskId={null} />
        </MemoryRouter>
      </Provider>,
    );

    const titleInput = screen.getByLabelText("Название");
    fireEvent.change(titleInput, { target: { value: "New task" } });

    expect(mockHandleChange).toHaveBeenCalledWith("title");
    const changeFn = mockHandleChange.mock.results[0].value;
    expect(changeFn).toHaveBeenCalledWith("New task");
  });

  it("does not dispatch when isValid is false", async () => {
    (useTaskForm as jest.Mock).mockReturnValue({
      formData: {
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: "",
      },
      isEdit: false,
      handleChange: mockHandleChange,
      getPayload: jest.fn(),
      isValid: jest.fn(() => false),
      resetForm: mockResetForm,
    });

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal isOpen={true} onClose={onClose} editingTaskId={null} />
        </MemoryRouter>
      </Provider>,
    );

    const submitBtn = screen.getByText("Создать");
    fireEvent.click(submitBtn);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("calls resetForm when modal is closed via cancel button", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <TaskFormModal isOpen={true} onClose={onClose} editingTaskId={null} />
        </MemoryRouter>
      </Provider>,
    );

    const cancelBtn = screen.getByText("Отмена");
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
    expect(mockResetForm).toHaveBeenCalled();
  });
});