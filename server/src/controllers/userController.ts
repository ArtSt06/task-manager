import { Response } from "express";

import { AuthRequest } from "@middleware/auth";

import User from "@models/UserModel";

import { DEFAULT_SETTINGS } from "@shared/constants";

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({
        firebaseUid,
        email: req.user!.email,
      });
      await user.save();
    }

    res.json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения настроек" });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    const { theme, defaultPriority, defaultStatus, confirmDelete } = req.body;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (theme !== undefined) user.settings.theme = theme;
    if (defaultPriority !== undefined)
      user.settings.defaultPriority = defaultPriority;
    if (defaultStatus !== undefined)
      user.settings.defaultStatus = defaultStatus;
    if (confirmDelete !== undefined)
      user.settings.confirmDelete = confirmDelete;

    await user.save();
    res.json({ settings: user.settings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка обновления настроек пользователя" });
  }
};

export const resetSettings = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.settings = DEFAULT_SETTINGS;
    await user.save();

    res.json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сброса настроек" });
  }
};
