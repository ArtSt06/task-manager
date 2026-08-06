import type { Task } from "@shared/types";

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { jest } from "@jest/globals";

import { createTestStore } from "@tests/helpers";
import { ConfirmProvider } from "@contexts/ConfirmContext";

import TaskItem from "@components/tasks/TaskItem";

const mockDispatch = jest.fn();
jest.mock("@store/reduxHooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(() => []),
}));

describe("TaskItem", () => {
  const mockTask: Task = {
    _id: "task-1",
    title: "Task",
    description: "Description",
    priority: "high",
    status: "todo",
    deadline: "2025-01-15T10:00:00Z",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  };

  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onToggleStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task data correctly", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={mockTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Task")).toBeInTheDocument();
    expect(screen.getByText("Высокий")).toBeInTheDocument();
    expect(screen.getByText("К выполнению")).toBeInTheDocument();
    expect(screen.getByText(/15.01.2025/)).toBeInTheDocument();
    expect(screen.getByText(/10.01.2025/)).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("toggles description when title is clicked", () => {
    const { container } = render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={mockTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    const title = screen.getByText("Task");
    const descriptionElement = container.querySelector(".task-description");

    expect(descriptionElement).not.toHaveClass("expanded");

    fireEvent.click(title);
    
    expect(descriptionElement).toHaveClass("expanded");

    fireEvent.click(title);

    expect(descriptionElement).not.toHaveClass("expanded");
  });

  it("calls onToggleStatus when status button is clicked", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={mockTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    const toggleButton = screen.getByRole("button", { name: /Выполнить/i });
    fireEvent.click(toggleButton);

    expect(onToggleStatus).toHaveBeenCalledWith("task-1", "done");
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={mockTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    const deleteButton = screen.getByRole("button", { name: /Удалить/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("task-1", "Task");
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={mockTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    const editButton = screen.getByRole("button", { name: /Редактировать/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it("renders with correct status class", () => {
    const { container, rerender } = render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={{ ...mockTask, status: "todo" }}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );

    const rootElement = container.querySelector(".task-item");

    expect(rootElement).toHaveClass("status-todo");

    rerender(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={{ ...mockTask, status: "inProgress" }}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(rootElement).toHaveClass("status-inProgress");

    rerender(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <ConfirmProvider>
            <TaskItem
              task={{ ...mockTask, status: "done" }}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </ConfirmProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(rootElement).toHaveClass("status-done");
  });
});
