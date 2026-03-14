// server/services/processService.js
import { exec } from "child_process";

export function runCommand({ projectRoot, command }) {
  return new Promise(resolve => {
    exec(command, { cwd: projectRoot }, (err, stdout, stderr) => {
      resolve({
        ok: !err,
        stdout,
        stderr
      });
    });
  });
}