export function debugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
) {
  // #region agent log
  fetch("http://127.0.0.1:7889/ingest/db038549-8d2c-48bd-bed4-077287b64337", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "576b9a",
    },
    body: JSON.stringify({
      sessionId: "576b9a",
      location,
      message,
      data,
      timestamp: Date.now(),
      hypothesisId,
    }),
  }).catch(() => {});
  // #endregion
}
