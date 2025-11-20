import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export type WebViewOverlayProps = {
  title?: string;
  url: string;
  visible: boolean;
  onClose: () => void;
};

export function WebViewOverlay({ title, url, visible, onClose }: WebViewOverlayProps) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? 'Web Content'}</Text>
          <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>
        <WebView source={{ uri: url }} startInLoadingState style={styles.webview} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
