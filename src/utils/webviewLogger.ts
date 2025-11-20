const WEBVIEW_LOG_PREFIX = '[WEBVIEW]';
const SECTION_DIVIDER = '='.repeat(16);

function buildTimestamp() {
  const now = new Date();

  return {
    iso: now.toISOString(),
    epochMs: now.getTime(),
  };
}

function formatDetails(details?: Record<string, unknown>) {
  if (!details) {
    return undefined;
  }

  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
}

export function logWebview(event: string, details?: Record<string, unknown>) {
  const timestamp = buildTimestamp();
  const formattedDetails = formatDetails({ timestamp: timestamp.iso, epochMs: timestamp.epochMs, ...details });
  const header = `${WEBVIEW_LOG_PREFIX} ${SECTION_DIVIDER} ${event.toUpperCase()} @ ${timestamp.iso} ${SECTION_DIVIDER}`;

  console.log(header);
  if (formattedDetails) {
    console.log(`${WEBVIEW_LOG_PREFIX} ${formattedDetails}`);
  }
}
