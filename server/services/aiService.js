// server/services/aiService.js
import OpenRouter from "@openrouter/sdk";
import * as fileService from "./fileService.js";
import * as diffService from "./diffService.js";

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

function buildSystemPrompt() {
  return `
Du bist ein TypeScript Coding Assistant.
Du arbeitest patch-basiert.
Du erzeugst niemals kompletten Code, sondern nur Änderungen.
`;
}

export async function chat({ projectRoot, message, contextFile }) {
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: message }
  ];

  if (contextFile) {
    const content = fileService.readFile(projectRoot, contextFile);
    messages.push({
      role: "user",
      content: `Hier ist die Datei ${contextFile}:\n\n${content}`
    });
  }

  const response = await client.chat.completions.create({
    model: "mistralai/mistral-nemo",
    messages
  });

  const reply = response.choices[0].message.content;

  // KI-Actions extrahieren
  const actions = [];

  if (reply.includes("openFile:")) {
    const path = reply.split("openFile:")[1].trim().split("\n")[0];
    actions.push({ type: "openFile", path });
  }

  if (reply.includes("createFile:")) {
    const path = reply.split("createFile:")[1].trim().split("\n")[0];
    actions.push({ type: "createFile", path });
  }

  if (reply.includes("showDiff:")) {
    const path = reply.split("showDiff:")[1].trim().split("\n")[0];
    actions.push({ type: "showDiff", path });
  }

  return { reply, actions };
}

export async function editFile({ projectRoot, path, instructions }) {
  const original = fileService.readFile(projectRoot, path);

  const response = await client.chat.completions.create({
    model: "mistralai/mistral-nemo",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: `Bearbeite die Datei ${path}.\n\nAnweisungen:\n${instructions}\n\nOriginal:\n${original}`
      }
    ]
  });

  const modified = response.choices[0].message.content;
  const diff = diffService.generateDiff(original, modified, path);

  return { path, original, modified, diff };
}

export async function refactor({ projectRoot, path, functionName }) {
  const original = fileService.readFile(projectRoot, path);

  const response = await client.chat.completions.create({
    model: "mistralai/mistral-nemo",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: `Refactore die Funktion ${functionName} in der Datei ${path}.\n\nOriginal:\n${original}`
      }
    ]
  });

  const modified = response.choices[0].message.content;
  const diff = diffService.generateDiff(original, modified, path);

  return { path, original, modified, diff };
}

export async function dryRun({ projectRoot, message }) {
  const response = await client.chat.completions.create({
    model: "mistralai/mistral-nemo",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: `Dry-Run: ${message}` }
    ]
  });

  const patches = JSON.parse(response.choices[0].message.content);

  return { patches };
}