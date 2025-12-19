import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import type { EditorToolsPanelProps } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/**
 * EditorToolsPanel Component
 * A collapsible panel for organizing editor tools
 * Developers can customize the content using renderContent prop
 */
export const EditorToolsPanel: React.FC<EditorToolsPanelProps> = ({
  title = 'Editor Tools',
  initialExpanded = false,
  renderContent,
  containerStyle,
  headerStyle,
  contentStyle,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const togglePanel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.header, headerStyle]}
        onPress={togglePanel}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.arrow}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {/* Content */}
      {expanded && (
        <View style={[styles.content, contentStyle]}>
          {renderContent && renderContent()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    padding: 12,
    backgroundColor: '#fafafa',
  },
});
