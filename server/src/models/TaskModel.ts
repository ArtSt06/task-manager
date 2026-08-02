import type { Priority, Status } from "@shared/types";

import { PRIORITIES, STATUSES } from "@shared/constants";

import { Schema, model, Document } from "mongoose";

export interface TaskEntity extends Document {
  firebaseUid: string;

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
    firebaseUid: { type: String, required: true, index: true },

    title: { type: String, required: true },
    description: { type: String },

    priority: {
      type: String,
      enum: PRIORITIES,
      default: "medium",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "todo",
    },

    deadline: { type: Date },
  },
  { timestamps: true },
);

export default model<TaskEntity>("Task", TaskSchema);
