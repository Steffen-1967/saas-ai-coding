// server/api/_utils.js
export function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}