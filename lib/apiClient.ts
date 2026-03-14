const BASE = "http://localhost:3001/api";

async function json<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  openProject(path: string) {
    return json<{ ok: boolean; root: string }>(`${BASE}/project/open`, {
      method: "POST",
      body: JSON.stringify({ path }),
    });
  },

  getProjectInfo() {
    return json<{ root: string; config: any }>(`${BASE}/project/info`);
  },

  getFileTree(path?: string) {
    const url = path
      ? `${BASE}/files/tree?path=${encodeURIComponent(path)}`
      : `${BASE}/files/tree`;

    return json(url);
  },

  readFile(filePath: string) {
    const url = `${BASE}/files/read?path=${encodeURIComponent(filePath)}`;
    return json(url);
  },

  writeFile(path: string, content: string) {
    return json<{ ok: boolean }>(`${BASE}/files/write`, {
      method: "POST",
      body: JSON.stringify({ path, content }),
    });
  },

  createFile(path: string) {
    return json<{ ok: boolean }>(`${BASE}/files/create`, {
      method: "POST",
      body: JSON.stringify({ path, type: "file" }),
    });
  },

  createFolder(path: string) {
    return json<{ ok: boolean }>(`${BASE}/files/create`, {
      method: "POST",
      body: JSON.stringify({ path, type: "folder" }),
    });
  },

  chat(message: string, contextFile?: string) {
    return json(`${BASE}/ai/chat`, {
      method: "POST",
      body: JSON.stringify({ message, contextFile }),
    });
  },

  dryRun(message: string) {
    return json(`${BASE}/ai/dryRun`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};
