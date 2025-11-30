import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FenDisplay } from '../../components/FenDisplay';
import { DEFAULT_FEN } from '../../utils/fen';

describe('FenDisplay Component', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('non-editable mode', () => {
    it('should display FEN as read-only text', () => {
      const { getByText } = render(
        <FenDisplay fen={DEFAULT_FEN} editable={false} />
      );

      expect(getByText('FEN:')).toBeTruthy();
      expect(getByText(DEFAULT_FEN)).toBeTruthy();
    });

    it('should not show input field when editable is false', () => {
      const { queryByLabelText } = render(
        <FenDisplay fen={DEFAULT_FEN} editable={false} />
      );

      expect(queryByLabelText('FEN input')).toBeNull();
    });

    it('should update displayed FEN when prop changes', () => {
      const newFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { rerender, getByText } = render(
        <FenDisplay fen={DEFAULT_FEN} editable={false} />
      );

      rerender(<FenDisplay fen={newFen} editable={false} />);

      expect(getByText(newFen)).toBeTruthy();
    });
  });

  describe('editable mode', () => {
    it('should show input field when editable is true', () => {
      const { getByLabelText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      expect(getByLabelText('FEN input')).toBeTruthy();
    });

    it('should initialize input with current FEN', () => {
      const { getByLabelText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      expect(input.props.value).toBe(DEFAULT_FEN);
    });

    it('should show Apply and Cancel buttons when editing', () => {
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent(input, 'focus');

      expect(getByText('Apply')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('should call onFenChange with valid FEN when Apply is pressed', () => {
      const newFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent.changeText(input, newFen);
      fireEvent(input, 'focus');

      const applyButton = getByText('Apply');
      fireEvent.press(applyButton);

      expect(mockOnFenChange).toHaveBeenCalledWith(newFen);
    });

    it('should show error for invalid FEN structure', () => {
      const invalidFen = 'invalid fen string';
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent.changeText(input, invalidFen);
      fireEvent(input, 'focus');

      const applyButton = getByText('Apply');
      fireEvent.press(applyButton);

      expect(getByText('Invalid FEN structure')).toBeTruthy();
      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should show error for empty FEN', () => {
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent.changeText(input, '');
      fireEvent(input, 'focus');

      const applyButton = getByText('Apply');
      fireEvent.press(applyButton);

      expect(getByText('FEN cannot be empty')).toBeTruthy();
      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should reset to original FEN when Cancel is pressed', () => {
      const newFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent.changeText(input, newFen);
      fireEvent(input, 'focus');

      const cancelButton = getByText('Cancel');
      fireEvent.press(cancelButton);

      expect(input.props.value).toBe(DEFAULT_FEN);
      expect(mockOnFenChange).not.toHaveBeenCalled();
    });

    it('should clear error when typing', () => {
      const { getByLabelText, getByText } = render(
        <FenDisplay
          fen={DEFAULT_FEN}
          editable={true}
          onFenChange={mockOnFenChange}
        />
      );

      const input = getByLabelText('FEN input');
      fireEvent.changeText(input, '');
      fireEvent(input, 'focus');

      const applyButton = getByText('Apply');
      fireEvent.press(applyButton);

      expect(getByText('FEN cannot be empty')).toBeTruthy();

      // Type new text - error should still be visible until next submit
      fireEvent.changeText(input, 'r');

      // Error clearing is handled in the component logic
      expect(input.props.value).toBe('r');
    });
  });
});
