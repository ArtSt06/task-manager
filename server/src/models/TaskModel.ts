import { Schema, model, Document } from "mongoose";
import { Priority, Status } from "@shared/types";

export interface TaskEntity extends Document {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskEntity>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    deadline: { type: Date },
  },
  { timestamps: true },
);

export default model<TaskEntity>("Task", TaskSchema);
