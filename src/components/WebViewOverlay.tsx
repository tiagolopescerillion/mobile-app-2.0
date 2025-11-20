import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export type WebViewOverlayProps = {
  title?: string;
  url: string;
  visible: boolean;
  onClose: () => void;
  keepMounted?: boolean;
};

export function WebViewOverlay({ title, url, visible, onClose, keepMounted = false }: WebViewOverlayProps) {
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
        <WebView source={{ uri: url }} startInLoadingState style={styles.webview} />
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
