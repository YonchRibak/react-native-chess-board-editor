import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditableBoard } from '../../components/EditableBoard';
import { DEFAULT_FEN } from '../../utils/fen';

describe('EditableBoard Component', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('rendering', () => {
    it('should render 64 squares', () => {
      const { getAllByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const squares = getAllByLabelText(/Square [a-h][1-8]/);
      expect(squares.length).toBe(64);
    });

    it('should render starting position pieces', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Check some key pieces
      expect(getByLabelText('Square a8 with r')).toBeTruthy();
      expect(getByLabelText('Square e8 with k')).toBeTruthy();
      expect(getByLabelText('Square a1 with R')).toBeTruthy();
      expect(getByLabelText('Square e1 with K')).toBeTruthy();
    });

    it('should render empty squares', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Check some empty squares
      expect(getByLabelText('Square e4 empty')).toBeTruthy();
      expect(getByLabelText('Square d5 empty')).toBeTruthy();
    });

    it('should update when FEN changes', () => {
      const newFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { getByLabelText, rerender } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      expect(getByLabelText('Square e2 with P')).toBeTruthy();
      expect(getByLabelText('Square e4 empty')).toBeTruthy();

      rerender(<EditableBoard fen={newFen} onFenChange={mockOnFenChange} />);

      expect(getByLabelText('Square e2 empty')).toBeTruthy();
      expect(getByLabelText('Square e4 with P')).toBeTruthy();
    });
  });

  describe('piece selection', () => {
    it('should select piece when tapped', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const square = getByLabelText('Square e2 with P');
      fireEvent.press(square);

      // After selection, hint should change to show movement option
      expect(square.props.accessibilityHint).toBe('Move piece from e2 to e2');
    });

    it('should deselect piece when tapped again', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const square = getByLabelText('Square e2 with P');

      // Select
      fireEvent.press(square);

      // Deselect
      fireEvent.press(square);

      expect(mockOnFenChange).not.toHaveBeenCalled();
    });
  });

  describe('piece movement', () => {
    it('should move piece when selecting source then target', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Select e2 pawn
      const sourceSquare = getByLabelText('Square e2 with P');
      fireEvent.press(sourceSquare);

      // Move to e4
      const targetSquare = getByLabelText('Square e4 empty');
      fireEvent.press(targetSquare);

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      expect(newFen).toContain('4P3'); // Pawn on e4
    });

    it('should capture piece when moving to occupied square', () => {
      // Set up position where white pawn can capture black pawn
      const fen =
        'rnbqkbnr/pppppppp/8/8/3Pp3/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1';
      const { getByLabelText } = render(
        <EditableBoard fen={fen} onFenChange={mockOnFenChange} />
      );

      // Select d4 pawn
      const sourceSquare = getByLabelText('Square d4 with P');
      fireEvent.press(sourceSquare);

      // Capture on e4
      const targetSquare = getByLabelText('Square e4 with p');
      fireEvent.press(targetSquare);

      expect(mockOnFenChange).toHaveBeenCalled();
    });
  });

  describe('piece removal', () => {
    it('should remove piece on long press', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const square = getByLabelText('Square e2 with P');
      fireEvent(square, 'longPress');

      expect(mockOnFenChange).toHaveBeenCalled();
      const newFen = mockOnFenChange.mock.calls[0][0];
      // The e2 square should now be empty
      expect(newFen).toContain('PPPP1PPP'); // Missing pawn on e2
    });

    it('should clear selection when removing piece', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const square = getByLabelText('Square e2 with P');

      // Select
      fireEvent.press(square);

      // Remove
      fireEvent(square, 'longPress');

      expect(mockOnFenChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('board flipping', () => {
    it('should render flipped board when flipped=true', () => {
      const { getByLabelText } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          flipped={true}
        />
      );

      // When flipped, black should be at bottom
      expect(getByLabelText('Square a8 with r')).toBeTruthy();
      expect(getByLabelText('Square e8 with k')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should provide accessibility hints for empty squares', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const emptySquare = getByLabelText('Square e4 empty');
      expect(emptySquare.props.accessibilityHint).toBe('Empty square');
    });

    it('should provide accessibility hints for pieces', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const pieceSquare = getByLabelText('Square e2 with P');
      expect(pieceSquare.props.accessibilityHint).toBe(
        'Tap to select this piece'
      );
    });

    it('should provide accessibility hints for moving pieces', () => {
      const { getByLabelText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Select a piece
      const sourceSquare = getByLabelText('Square e2 with P');
      fireEvent.press(sourceSquare);

      // Check hint on target square
      const targetSquare = getByLabelText('Square e4 empty');
      expect(targetSquare.props.accessibilityHint).toBe(
        'Move piece from e2 to e4'
      );
    });
  });
});
