import { create } from "zustand";
import type { FileNode, DiffState, DryRunPatch } from "./types";
import { api } from "./apiClient";

type AppState = {
  projectRoot: string | null;

  // Neuer Lazy-Loading-Dateibaum:
  // tree[""] = Root
  // tree["src"] = Inhalt von src
  tree: Record<string, FileNode[]>;

  // Loading-Status pro Ordner
  loading: Record<string, boolean>;

  selectedFile: string | null;
  fileContent: string;

  diff: DiffState | null;
  dryRunPatches: DryRunPatch[];

  // --- Actions ---
  setProjectRoot(root: string | null): void;

  // Lazy-Loading: Ordner laden
  loadFolder(path: string): Promise<void>;

  // Lazy-Loading: Datei laden
  loadFile(path: string): Promise<void>;

  selectFile(path: string): void;
  setFileContent(content: string): void;

  setDiff(diff: DiffState | null): void;
  setDryRunPatches(patches: DryRunPatch[]): void;
};

export const useAppState = create<AppState>((set, get) => ({
  projectRoot: null,

  tree: {},
  loading: {},

  selectedFile: null,
  fileContent: "",

  diff: null,
  dryRunPatches: [],

  setProjectRoot: (projectRoot) => set({ projectRoot }),

  // Lazy-Loading eines Ordners
  async loadFolder(path: string) {
    const { tree, loading } = get();

    // Wenn schon geladen → nicht erneut laden
    if (tree[path] || loading[path]) return;

    // Loading-Flag setzen
    set({
      loading: { ...loading, [path]: true }
    });

    // API-Aufruf
    const data = await api.getFileTree(path);

    // Ergebnis speichern
    set(state => ({
      loading: { ...state.loading, [path]: false },
      tree: { ...state.tree, [path]: data.items }
    }));
  },

  async loadFile(path: string) {
    const res = await api.readFile(path);
    set({ fileContent: res.content });
  },

  selectFile: async (selectedFile) => {
    set({ selectedFile });
    await get().loadFile(selectedFile);
  },

  setFileContent: (fileContent) => set({ fileContent }),

  setDiff: (diff) => set({ diff }),
  setDryRunPatches: (dryRunPatches) => set({ dryRunPatches }),
}));