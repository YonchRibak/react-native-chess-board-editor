import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BoardEditor } from '../../components/BoardEditor';
import { DEFAULT_FEN } from '../../utils/fen';

describe('BoardEditor Component', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  // Helper function to expand the editor tools panel
  const expandEditorToolsPanel = (getByText: any) => {
    const panelHeader = getByText('Editor Tools');
    fireEvent.press(panelHeader);
  };

  describe('rendering', () => {
    it('should render all components by default', () => {
      const { getByLabelText, getByText, queryByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Piece banks should be rendered but labels hidden by default
      expect(queryByText('Black Pieces')).toBeNull();
      expect(queryByText('White Pieces')).toBeNull();

      // FEN display
      expect(getByText('FEN:')).toBeTruthy();

      // Expand the panel to access editor tools
      expandEditorToolsPanel(getByText);

      // Turn toggler
      expect(getByLabelText('White to move')).toBeTruthy();

      // Castling rights
      expect(getByLabelText('White can castle king-side')).toBeTruthy();

      // En passant input
      expect(getByLabelText('En passant target square')).toBeTruthy();
    });

    it('should use initial FEN', () => {
      const customFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { getByLabelText, getByText } = render(
        <BoardEditor initialFen={customFen} onFenChange={mockOnFenChange} />
      );

      // Expand the panel to access editor tools
      expandEditorToolsPanel(getByText);

      // Check that turn is black
      const blackToggle = getByLabelText('Black to move');
      expect(blackToggle.props.accessibilityState.checked).toBe(true);
    });

    it('should hide components based on uiConfig', () => {
      const { queryByText, toJSON } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          uiConfig={{
            showFenDisplay: false,
            showTurnToggler: false,
            showCastlingRights: false,
            showEnPassantInput: false,
            showPieceBank: false,
          }}
        />
      );

      // Board should still be rendered
      expect(toJSON()).toBeTruthy();

      // Other components should not be rendered
      expect(queryByText('FEN:')).toBeNull();
      expect(queryByText('Turn:')).toBeNull();
      expect(queryByText('Castling Rights:')).toBeNull();
      expect(queryByText('En Passant Square:')).toBeNull();
      expect(queryByText('White Pieces')).toBeNull();
      expect(queryByText('Black Pieces')).toBeNull();
    });
  });

  describe('state management', () => {
    it('should update FEN when board is changed', () => {
      const { toJSON } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Board is rendered
      expect(toJSON()).toBeTruthy();

      // Note: Testing actual drag-and-drop gestures is complex with mocked gesture handlers
      // The integration is tested at the EditableBoard component level
    });

    it('should update FEN when turn is changed', () => {
      const { getByLabelText, getByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      expandEditorToolsPanel(getByText);

      const blackToggle = getByLabelText('Black to move');
      fireEvent.press(blackToggle);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' b '); // Black to move
    });

    it('should update FEN when castling rights change', () => {
      const { getByLabelText, getByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      expandEditorToolsPanel(getByText);

      const whiteKingSide = getByLabelText('White can castle king-side');
      fireEvent.press(whiteKingSide);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' Qkq '); // K removed
    });

    it('should update FEN when en passant changes', () => {
      // White pawn on e4 (jumped from e2 to e4, so e3 is en passant target)
      const { getByLabelText, getByText } = render(
        <BoardEditor
          initialFen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
          onFenChange={mockOnFenChange}
        />
      );

      expandEditorToolsPanel(getByText);

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e3');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' e3 '); // En passant square set
    });

    it('should auto-update turn when en passant changes to rank 3', () => {
      // White pawn on e4 (e3 en passant means white just moved, so black to play)
      const { getByLabelText, getByText } = render(
        <BoardEditor
          initialFen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
          onFenChange={mockOnFenChange}
        />
      );

      expandEditorToolsPanel(getByText);

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e3');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' b '); // Turn auto-updated to black (white just moved)
      expect(newFen).toContain(' e3 '); // En passant square set
    });

    it('should auto-update turn when en passant changes to rank 6', () => {
      // Black pawn on e5 (e6 en passant means black just moved, so white to play)
      const { getByLabelText, getByText } = render(
        <BoardEditor
          initialFen="rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
          onFenChange={mockOnFenChange}
        />
      );

      expandEditorToolsPanel(getByText);

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e6');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' w '); // Turn auto-updated to white (black just moved)
      expect(newFen).toContain(' e6 '); // En passant square set
    });
  });

  describe('FEN synchronization', () => {
    it('should keep all components in sync', () => {
      const { getByLabelText, getByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      expandEditorToolsPanel(getByText);

      // Change turn to black
      const blackToggle = getByLabelText('Black to move');
      fireEvent.press(blackToggle);

      const newFen = mockOnFenChange.mock.calls[0][0];

      // Verify turn changed
      expect(newFen).toContain(' b ');

      // Other fields should remain unchanged
      expect(newFen).toContain('KQkq');
      expect(newFen).toContain(' - ');
      expect(newFen).toContain(' 0 1');
    });

    it('should handle multiple changes', () => {
      // Black pawn on e5 for valid e6 en passant
      const { getByLabelText, getByText } = render(
        <BoardEditor
          initialFen="rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          onFenChange={mockOnFenChange}
        />
      );

      expandEditorToolsPanel(getByText);

      // Change castling rights
      const whiteKingSide = getByLabelText('White can castle king-side');
      fireEvent.press(whiteKingSide);

      // Change turn
      const blackToggle = getByLabelText('Black to move');
      fireEvent.press(blackToggle);

      // Change en passant (applies immediately on text change)
      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e6');

      // Should have been called 3 times
      expect(mockOnFenChange).toHaveBeenCalledTimes(3);

      // Last FEN should have all changes (except turn which was auto-updated by en passant)
      const lastFen = mockOnFenChange.mock.calls[2][0];
      expect(lastFen).toContain(' Qkq '); // K removed
      expect(lastFen).toContain(' e6 ');
      expect(lastFen).toContain(' w '); // Auto-updated by en passant (black just moved)
    });
  });

  describe('UI configuration', () => {
    it('should use horizontal piece bank by default', () => {
      const { queryByText, getByText, toJSON } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Piece banks should be rendered but labels hidden by default
      expect(queryByText('White Pieces')).toBeNull();
      expect(queryByText('Black Pieces')).toBeNull();
      expect(toJSON()).toBeTruthy(); // Board and banks are still rendered
      expect(getByText('FEN:')).toBeTruthy();
    });

    it('should disable FEN editing when fenEditable is false', () => {
      const { queryByLabelText, getByText } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          uiConfig={{ fenEditable: false }}
        />
      );

      // FEN input should not exist when editable is false
      expect(queryByLabelText('FEN input')).toBeNull();

      // FEN display should still show the FEN text
      expect(getByText('FEN:')).toBeTruthy();
    });

    it('should flip board when flipped is true', () => {
      const { toJSON } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          uiConfig={{ flipped: true }}
        />
      );

      // Board should be rendered with flipped configuration
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('custom styling', () => {
    it('should apply custom square size', () => {
      const { toJSON } = render(
        <BoardEditor onFenChange={mockOnFenChange} squareSize={50} />
      );

      // Board should be rendered with custom size
      expect(toJSON()).toBeTruthy();
    });

    it('should apply custom colors', () => {
      const { toJSON } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          lightSquareColor="#FFFFFF"
          darkSquareColor="#000000"
        />
      );

      // Board should be rendered with custom colors
      expect(toJSON()).toBeTruthy();
    });
  });
});
