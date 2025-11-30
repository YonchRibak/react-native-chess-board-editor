import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EnPassantInput } from '../../components/EnPassantInput';

describe('EnPassantInput Component', () => {
  const mockOnEnPassantChange = jest.fn();

  beforeEach(() => {
    mockOnEnPassantChange.mockClear();
  });

  describe('rendering', () => {
    it('should render input with current en passant square', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="e3"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      expect(input.props.value).toBe('e3');
    });

    it('should render input with "-" when no en passant', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      expect(input.props.value).toBe('-');
    });

    it('should show clear button when value is not "-"', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="e3"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      expect(getByLabelText('Clear en passant')).toBeTruthy();
    });

    it('should not show clear button when value is "-"', () => {
      const { queryByLabelText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      expect(queryByLabelText('Clear en passant')).toBeNull();
    });

    it('should show help text', () => {
      const { getByText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      expect(
        getByText('Valid squares: a3-h3 (white to move) or a6-h6 (black to move)')
      ).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onEnPassantChange with valid square on blur', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e3');
      fireEvent(input, 'blur');

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
    });

    it('should convert input to lowercase', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'E3');
      fireEvent(input, 'blur');

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('e3');
    });

    it('should accept empty string as "-"', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="e3"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, '');
      fireEvent(input, 'blur');

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('-');
    });

    it('should show error for invalid format', () => {
      const { getByLabelText, getByText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e4');
      fireEvent(input, 'blur');

      expect(
        getByText('Must be a square on rank 3 or 6 (e.g., e3, d6) or "-"')
      ).toBeTruthy();
      expect(mockOnEnPassantChange).not.toHaveBeenCalled();
    });

    it('should show error for invalid file', () => {
      const { getByLabelText, getByText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'i3');
      fireEvent(input, 'blur');

      expect(
        getByText('Must be a square on rank 3 or 6 (e.g., e3, d6) or "-"')
      ).toBeTruthy();
    });

    it('should clear error when typing after error', () => {
      const { getByLabelText, getByText, queryByText } = render(
        <EnPassantInput
          enPassantSquare="-"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      fireEvent.changeText(input, 'e4');
      fireEvent(input, 'blur');

      expect(
        getByText('Must be a square on rank 3 or 6 (e.g., e3, d6) or "-"')
      ).toBeTruthy();

      fireEvent.changeText(input, 'e');

      expect(
        queryByText('Must be a square on rank 3 or 6 (e.g., e3, d6) or "-"')
      ).toBeNull();
    });

    it('should clear en passant when clear button is pressed', () => {
      const { getByLabelText } = render(
        <EnPassantInput
          enPassantSquare="e3"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const clearButton = getByLabelText('Clear en passant');
      fireEvent.press(clearButton);

      expect(mockOnEnPassantChange).toHaveBeenCalledWith('-');
    });

    it('should accept all valid rank 3 squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        mockOnEnPassantChange.mockClear();
        const { getByLabelText } = render(
          <EnPassantInput
            enPassantSquare="-"
            onEnPassantChange={mockOnEnPassantChange}
          />
        );

        const input = getByLabelText('En passant target square');
        fireEvent.changeText(input, `${file}3`);
        fireEvent(input, 'blur');

        expect(mockOnEnPassantChange).toHaveBeenCalledWith(`${file}3`);
      });
    });

    it('should accept all valid rank 6 squares', () => {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      files.forEach((file) => {
        mockOnEnPassantChange.mockClear();
        const { getByLabelText } = render(
          <EnPassantInput
            enPassantSquare="-"
            onEnPassantChange={mockOnEnPassantChange}
          />
        );

        const input = getByLabelText('En passant target square');
        fireEvent.changeText(input, `${file}6`);
        fireEvent(input, 'blur');

        expect(mockOnEnPassantChange).toHaveBeenCalledWith(`${file}6`);
      });
    });
  });

  describe('state updates', () => {
    it('should update when en passant square prop changes', () => {
      const { getByLabelText, rerender } = render(
        <EnPassantInput
          enPassantSquare="e3"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      const input = getByLabelText('En passant target square');
      expect(input.props.value).toBe('e3');

      rerender(
        <EnPassantInput
          enPassantSquare="d6"
          onEnPassantChange={mockOnEnPassantChange}
        />
      );

      expect(input.props.value).toBe('d6');
    });
  });
});
