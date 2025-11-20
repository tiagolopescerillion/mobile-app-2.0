const WEBVIEW_LOG_PREFIX = '[WEBVIEW]';
const SECTION_DIVIDER = '='.repeat(16);

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
  const formattedDetails = formatDetails(details);
  const header = `${WEBVIEW_LOG_PREFIX} ${SECTION_DIVIDER} ${event} ${SECTION_DIVIDER}`;

  console.log(header);
  if (formattedDetails) {
    console.log(`${WEBVIEW_LOG_PREFIX} ${formattedDetails}`);
  }
}
