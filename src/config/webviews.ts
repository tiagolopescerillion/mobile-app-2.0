import webviewConfig from '../../CONFIGURATIONS/webviews.json';

export type WebviewConfig = {
  title?: string;
  url?: string;
  baseUrl?: string;
  path?: string;
  baseKey?: string;
};

export type WebviewConfigMap = Record<string, WebviewConfig>;

const parsedConfigs: WebviewConfigMap = webviewConfig as WebviewConfigMap;

function resolveUrl(key: string, config: WebviewConfig): string | null {
  if (config.url) {
    return config.url;
  }

  const baseFromReference = config.baseKey ? parsedConfigs[config.baseKey] : undefined;
  const baseUrl = config.baseUrl ?? baseFromReference?.url ?? baseFromReference?.baseUrl;

  if (baseUrl && config.path) {
    return `${baseUrl}${config.path}`;
  }

  return null;
}

export function getWebviewConfiguration(key: string): (WebviewConfig & { key: string; url: string }) | null {
  const config = parsedConfigs[key];

  if (!config) {
    return null;
  }

  const resolvedUrl = resolveUrl(key, config);

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

export function listWebviewConfigurations(): Array<WebviewConfig & { key: string; url: string }> {
  return Object.entries(parsedConfigs)
    .map(([key, value]) => {
      const url = resolveUrl(key, value);

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
