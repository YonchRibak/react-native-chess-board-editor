import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { BoardEditor } from 'react-native-chess-board-editor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function App() {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [key, setKey] = useState(0);
  const [showCustomExample, setShowCustomExample] = useState(false);

  const handleRefresh = () => {
    setFen(INITIAL_FEN);
    setKey(prevKey => prevKey + 1);
  };

  const toggleExample = () => {
    setShowCustomExample(!showCustomExample);
  };

  // Custom editor tools renderer example
  // Shows how to place some tools inside the panel and others outside
  const renderCustomEditorTools = (defaultTools) => {
    return {
      // Tools inside the collapsible panel
      inPanel: (
        <View>
          <View style={styles.customToolContainer}>
            {defaultTools.enPassantInput}
          </View>
          <View style={styles.customNote}>
            <Text style={styles.customNoteText}>
              En Passant is in the panel
            </Text>
          </View>
        </View>
      ),
      // Tools outside the panel (always visible, between FEN and panel)
      outside: (
        <View>
          <View style={styles.customToolContainer}>
            {defaultTools.turnToggler}
          </View>
          <View style={styles.customToolContainer}>
            {defaultTools.castlingRights}
          </View>
          <View style={styles.customNote}>
            <Text style={styles.customNoteText}>
              Turn & Castling are always visible (outside panel)
            </Text>
          </View>
        </View>
      ),
    };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Reset Board</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExample}>
            <Text style={styles.toggleButtonText}>
              {showCustomExample ? 'Default Editor' : 'Custom Editor'}
            </Text>
          </TouchableOpacity>
        </View>

        {!showCustomExample ? (
          <BoardEditor
            key={key}
            initialFen={fen}
            onFenChange={setFen}
            squareSize={35}
            containerStyle={styles.boardEditor}
            uiConfig={{
              bankLayout: 'horizontal',
              showFenDisplay: true,
              fenEditable: true,
              showCastlingRights: true,
              showEnPassantInput: true,
              showTurnToggler: true,
              showPieceBank: true,
              flipped: false,
              showEditorToolsPanel: true,
              editorToolsPanelExpanded: false,
            }}
          />
        ) : (
          <BoardEditor
            key={`custom-${key}`}
            initialFen={fen}
            onFenChange={setFen}
            squareSize={35}
            containerStyle={styles.boardEditor}
            uiConfig={{
              bankLayout: 'horizontal',
              showFenDisplay: true,
              fenEditable: true,
              showCastlingRights: true,
              showEnPassantInput: true,
              showTurnToggler: true,
              showPieceBank: true,
              flipped: false,
              showEditorToolsPanel: true,
              editorToolsPanelExpanded: true,
            }}
            renderEditorTools={renderCustomEditorTools}
          />
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  boardEditor: {
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  customToolContainer: {
    marginBottom: 12,
  },
  customNote: {
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  customNoteText: {
    color: '#856404',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
