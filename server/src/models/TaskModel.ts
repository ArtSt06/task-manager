import type { Priority, Status } from "@shared/types";

import { PRIORITIES, STATUSES, DEFAULT_SETTINGS } from "@shared/constants";

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
      default: DEFAULT_SETTINGS.defaultPriority,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: DEFAULT_SETTINGS.defaultStatus,
    },

    deadline: { type: Date },
  },
  { timestamps: true },
);

export default model<TaskEntity>("Task", TaskSchema);
