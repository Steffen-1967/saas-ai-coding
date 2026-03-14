export type FileNode = {
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
};

export type DiffState = {
  path: string;
  original: string;
  modified: string;
  diffText?: string;
};

export type DryRunPatch = {
  path: string;
  diff: string;
};