import webviewConfig from '../../CONFIGURATIONS/webviews.json';

export type WebviewConfig = {
  title?: string;
  url?: string;
  baseUrl?: string;
  path?: string;
  baseKey?: string;
};

export type WebviewConfigMap = Record<string, WebviewConfig>;

export type WebviewReplacements = {
  accountNumber?: string | null;
};

const parsedConfigs: WebviewConfigMap = webviewConfig as WebviewConfigMap;

function appendFocusMode(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('mode', 'focus');

    return url.toString();
  } catch (error) {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}mode=focus`;
  }
}

function combineBaseAndPath(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBase}${normalizedPath}`;
}

function applyReplacements(url: string, replacements?: WebviewReplacements): string | null {
  const accountPattern = /<account_no>|{account_no}/gi;

  if (!accountPattern.test(url)) {
    return url;
  }

  if (!replacements?.accountNumber) {
    return null;
  }

  return url.replace(accountPattern, replacements.accountNumber);
}

function resolveUrl(key: string, config: WebviewConfig, replacements?: WebviewReplacements): string | null {
  const baseFromReference = config.baseKey ? parsedConfigs[config.baseKey] : undefined;
  const baseUrl = config.baseUrl ?? baseFromReference?.url ?? baseFromReference?.baseUrl;

  const rawUrl =
    config.url ?? (baseUrl && config.path ? combineBaseAndPath(baseUrl, config.path) : null);

  if (!rawUrl) {
    return null;
  }

  const replacedUrl = applyReplacements(rawUrl, replacements);

  if (!replacedUrl) {
    return null;
  }

  return appendFocusMode(replacedUrl);
}

export function getWebviewConfiguration(
  key: string,
  replacements?: WebviewReplacements
): (WebviewConfig & { key: string; url: string }) | null {
  const config = parsedConfigs[key];

  if (!config) {
    return null;
  }

  const resolvedUrl = resolveUrl(key, config, replacements);

  if (!resolvedUrl) {
    return null;
  }

  return {
    key,
    url: resolvedUrl,
    title: config.title ?? key,
    baseKey: config.baseKey,
    baseUrl: config.baseUrl,
    path: config.path,
  };
}

export function listWebviewConfigurations(
  replacements?: WebviewReplacements
): Array<WebviewConfig & { key: string; url: string }> {
  return Object.entries(parsedConfigs)
    .map(([key, value]) => {
      const url = resolveUrl(key, value, replacements);

      if (!url) {
        return null;
      }

      return {
        key,
        url,
        title: value.title ?? key,
        baseKey: value.baseKey,
        baseUrl: value.baseUrl,
        path: value.path,
      } as WebviewConfig & { key: string; url: string };
    })
    .filter(Boolean) as Array<WebviewConfig & { key: string; url: string }>;
}
