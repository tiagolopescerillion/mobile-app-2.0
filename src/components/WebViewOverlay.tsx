import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  WebView,
  WebViewErrorEvent,
  WebViewNavigationEvent,
  WebViewProgressEvent,
  WebViewShouldStartLoadRequest,
} from 'react-native-webview';
import { logWebview } from '../utils/webviewLogger';

export type WebViewOverlayProps = {
  title?: string;
  url: string;
  visible: boolean;
  onClose: () => void;
  keepMounted?: boolean;
};

export function WebViewOverlay({ title, url, visible, onClose, keepMounted = false }: WebViewOverlayProps) {
  const loadTimingsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    logWebview(visible ? 'overlay_shown' : 'overlay_hidden', { url, title });
  }, [visible, title, url]);

  const handleLoadStart = (event: WebViewNavigationEvent) => {
    loadTimingsRef.current.set(event.nativeEvent.url, Date.now());
    logWebview('load_start', {
      url: event.nativeEvent.url,
      navigationType: event.nativeEvent.navigationType,
    });
  };

  const handleLoadProgress = (event: WebViewProgressEvent) => {
    logWebview('load_progress', { url: event.nativeEvent.url, progress: event.nativeEvent.progress });
  };

  const handleLoadEnd = (event: WebViewNavigationEvent) => {
    const startedAt = loadTimingsRef.current.get(event.nativeEvent.url);
    const durationMs = startedAt ? Date.now() - startedAt : undefined;

    if (startedAt) {
      loadTimingsRef.current.delete(event.nativeEvent.url);
    }

    logWebview('load_end', {
      url: event.nativeEvent.url,
      navigationType: event.nativeEvent.navigationType,
      durationMs,
    });
  };

  const handleHttpError = (event: WebViewErrorEvent) => {
    logWebview('http_error', {
      url: event.nativeEvent.url,
      statusCode: event.nativeEvent.statusCode,
      description: event.nativeEvent.description,
    });
  };

  const handleError = (event: WebViewErrorEvent) => {
    logWebview('runtime_error', {
      url: event.nativeEvent.url,
      code: event.nativeEvent.code,
      description: event.nativeEvent.description,
    });
  };

  const handleRequest = (request: WebViewShouldStartLoadRequest) => {
    logWebview('network_request', {
      url: request.url,
      navigationType: request.navigationType,
      mainDocumentURL: request.mainDocumentURL,
      isTopFrame: request.isTopFrame,
      method: request.method,
    });
    return true;
  };

  const handleResourceLoad = (event: WebViewNavigationEvent) => {
    logWebview('resource_loaded', {
      url: event.nativeEvent.url,
      navigationType: event.nativeEvent.navigationType,
    });
  };

  if (!visible && !keepMounted) {
    return null;
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.wrapper, visible ? styles.visible : styles.hidden]}
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? 'Web Content'}</Text>
          <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>
        <WebView
          source={{ uri: url }}
          startInLoadingState
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onHttpError={handleHttpError}
          onError={handleError}
          onShouldStartLoadWithRequest={handleRequest}
          onLoad={handleResourceLoad}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    zIndex: 50,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  closeLabel: {
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: 14,
  },
  webview: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
