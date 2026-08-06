import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import { useAppDispatch } from "@store/reduxHooks";
import { showConfirm, closeConfirm } from "@store/features/ui/uiSlice";

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextValue {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
  handleClose: () => void;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined,
);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (message: string, options?: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        dispatch(
          showConfirm({
            message,
            title: options?.title,
            confirmText: options?.confirmText,
            cancelText: options?.cancelText,
          }),
        );
      });
    },
    [dispatch],
  );

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
    dispatch(closeConfirm());
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    dispatch(closeConfirm());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    dispatch(closeConfirm());
  }, [dispatch]);

  return (
    <ConfirmContext.Provider
      value={{ confirm, handleConfirm, handleCancel, handleClose }}
    >
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextValue => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};
