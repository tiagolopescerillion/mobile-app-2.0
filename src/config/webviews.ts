import webviewConfig from '../../CONFIGURATIONS/webviews.json';

export type WebviewConfig = {
  title?: string;
  url: string;
};

export type WebviewConfigMap = Record<string, WebviewConfig>;

const parsedConfigs: WebviewConfigMap = webviewConfig as WebviewConfigMap;

export function getWebviewConfiguration(key: string): (WebviewConfig & { key: string }) | null {
  const config = parsedConfigs[key];

  if (!config) {
    return null;
  }

  const { url, title } = config;

  if (!url) {
    return null;
  }

  return {
    key,
    url,
    title: title ?? key,
  };
}

export function listWebviewConfigurations(): Array<WebviewConfig & { key: string }> {
  return Object.entries(parsedConfigs)
    .filter(([, value]) => Boolean(value?.url))
    .map(([key, value]) => ({
      key,
      url: value.url,
      title: value.title ?? key,
    }));
}
