import type { Settings } from "@shared/types";

import {
  THEMES,
  DEFAULT_SETTINGS,
  PRIORITIES,
  STATUSES,
  DEFAULT_STATUSES,
} from "@shared/constants";

import { Schema, model, Document } from "mongoose";

export interface UserEntity extends Document {
  firebaseUid: string;

  email: string;
  createdAt: Date;

  settings: Settings;
}

const UserSchema = new Schema<UserEntity>({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  settings: {
    theme: {
      type: String,
      enum: THEMES,
      default: DEFAULT_SETTINGS.theme,
    },
    defaultPriority: {
      type: String,
      enum: PRIORITIES,
      default: DEFAULT_SETTINGS.defaultPriority,
    },
    defaultStatus: {
      type: String,
      enum: DEFAULT_STATUSES,
      default: DEFAULT_SETTINGS.defaultStatus,
    },
    confirmDelete: {
      type: Boolean,
      default: DEFAULT_SETTINGS.confirmDelete,
    },
  },
});

export default model<UserEntity>("User", UserSchema);
