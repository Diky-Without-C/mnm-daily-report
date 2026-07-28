import { create } from "zustand";

interface FileState {
  files: Record<string, File | null>;
  setFile: (key: string, file: File | null) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: {},

  setFile: (key, file) =>
    set((state) => ({
      files: {
        ...state.files,
        [key]: file,
      },
    })),
}));
