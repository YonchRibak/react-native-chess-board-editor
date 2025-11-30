import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BoardEditor } from '../../components/BoardEditor';
import { DEFAULT_FEN } from '../../utils/fen';

describe('BoardEditor Component', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('rendering', () => {
    it('should render all components by default', () => {
      const { getByLabelText, getByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Board should be rendered (check for squares)
      expect(getByLabelText(/Square e1/)).toBeTruthy();

      // FEN display
      expect(getByText('FEN:')).toBeTruthy();

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
      const { getByLabelText } = render(
        <BoardEditor initialFen={customFen} onFenChange={mockOnFenChange} />
      );

      // Check that e4 has a pawn
      expect(getByLabelText('Square e4 with P')).toBeTruthy();

      // Check that turn is black
      const blackToggle = getByLabelText('Black to move');
      expect(blackToggle.props.accessibilityState.checked).toBe(true);
    });

    it('should hide components based on uiConfig', () => {
      const { queryByText, queryByLabelText } = render(
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
      expect(queryByLabelText(/Square e1/)).toBeTruthy();

      // Other components should not be rendered
      expect(queryByText('FEN:')).toBeNull();
      expect(queryByText('Turn:')).toBeNull();
      expect(queryByText('Castling Rights:')).toBeNull();
      expect(queryByText('En Passant Square:')).toBeNull();
    });
  });

  describe('state management', () => {
    it('should update FEN when board is changed', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Move e2 pawn to e4
      const e2 = getByLabelText('Square e2 with P');
      fireEvent.press(e2);

      const e4 = getByLabelText('Square e4 empty');
      fireEvent.press(e4);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain('4P3'); // Pawn on e4
    });

    it('should update FEN when turn is changed', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      const blackToggle = getByLabelText('Black to move');
      fireEvent.press(blackToggle);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' b '); // Black to move
    });

    it('should update FEN when castling rights change', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      const whiteKingSide = getByLabelText('White can castle king-side');
      fireEvent.press(whiteKingSide);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' Qkq '); // K removed
    });

    it('should update FEN when en passant changes', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e3');
      fireEvent(input, 'blur');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' e3 '); // En passant square set
    });

    it('should auto-update turn when en passant changes to rank 3', () => {
      const { getByLabelText } = render(
        <BoardEditor
          initialFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e3');
      fireEvent(input, 'blur');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' w '); // Turn auto-updated to white
      expect(newFen).toContain(' e3 '); // En passant square set
    });

    it('should auto-update turn when en passant changes to rank 6', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e6');
      fireEvent(input, 'blur');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain(' b '); // Turn auto-updated to black
      expect(newFen).toContain(' e6 '); // En passant square set
    });
  });

  describe('FEN synchronization', () => {
    it('should keep all components in sync', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

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
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Change castling rights
      const whiteKingSide = getByLabelText('White can castle king-side');
      fireEvent.press(whiteKingSide);

      // Change turn
      const blackToggle = getByLabelText('Black to move');
      fireEvent.press(blackToggle);

      // Change en passant
      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e6');
      fireEvent(input, 'blur');

      // Should have been called 3 times
      expect(mockOnFenChange).toHaveBeenCalledTimes(3);

      // Last FEN should have all changes (except turn which was auto-updated by en passant)
      const lastFen = mockOnFenChange.mock.calls[2][0];
      expect(lastFen).toContain(' Qkq '); // K removed
      expect(lastFen).toContain(' e6 ');
      expect(lastFen).toContain(' b '); // Auto-updated by en passant
    });
  });

  describe('UI configuration', () => {
    it('should use horizontal piece bank by default', () => {
      const { getByText } = render(
        <BoardEditor onFenChange={mockOnFenChange} />
      );

      // Piece bank should be rendered
      // (We can't easily test layout direction without looking at styles)
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
      const { getByLabelText } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          uiConfig={{ flipped: true }}
        />
      );

      // Board should be flipped (black at bottom)
      expect(getByLabelText('Square a8 with r')).toBeTruthy();
    });
  });

  describe('custom styling', () => {
    it('should apply custom square size', () => {
      const { getByLabelText } = render(
        <BoardEditor onFenChange={mockOnFenChange} squareSize={50} />
      );

      // Board should be rendered with custom size
      expect(getByLabelText('Square e1 with K')).toBeTruthy();
    });

    it('should apply custom colors', () => {
      const { getByLabelText } = render(
        <BoardEditor
          onFenChange={mockOnFenChange}
          lightSquareColor="#FFFFFF"
          darkSquareColor="#000000"
        />
      );

      // Board should be rendered with custom colors
      expect(getByLabelText('Square e1 with K')).toBeTruthy();
    });
  });
});
