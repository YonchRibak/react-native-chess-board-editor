import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CastlingRightsTogglers } from '../../components/CastlingRightsTogglers';

describe('CastlingRightsTogglers Component', () => {
  const mockOnCastlingChange = jest.fn();

  beforeEach(() => {
    mockOnCastlingChange.mockClear();
  });

  describe('rendering', () => {
    it('should render all four castling toggles', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="KQkq"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(getByLabelText('White can castle king-side')).toBeTruthy();
      expect(getByLabelText('White can castle queen-side')).toBeTruthy();
      expect(getByLabelText('Black can castle king-side')).toBeTruthy();
      expect(getByLabelText('Black can castle queen-side')).toBeTruthy();
    });

    it('should show all rights as checked when "KQkq"', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="KQkq"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(
        getByLabelText('White can castle king-side').props.accessibilityState
          .checked
      ).toBe(true);
      expect(
        getByLabelText('White can castle queen-side').props.accessibilityState
          .checked
      ).toBe(true);
      expect(
        getByLabelText('Black can castle king-side').props.accessibilityState
          .checked
      ).toBe(true);
      expect(
        getByLabelText('Black can castle queen-side').props.accessibilityState
          .checked
      ).toBe(true);
    });

    it('should show no rights as checked when "-"', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="-"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(
        getByLabelText('White can castle king-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('White can castle queen-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle king-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle queen-side').props.accessibilityState
          .checked
      ).toBe(false);
    });

    it('should show only white king-side when "K"', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="K"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(
        getByLabelText('White can castle king-side').props.accessibilityState
          .checked
      ).toBe(true);
      expect(
        getByLabelText('White can castle queen-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle king-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle queen-side').props.accessibilityState
          .checked
      ).toBe(false);
    });

    it('should show mixed rights correctly "Kq"', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="Kq"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(
        getByLabelText('White can castle king-side').props.accessibilityState
          .checked
      ).toBe(true);
      expect(
        getByLabelText('White can castle queen-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle king-side').props.accessibilityState
          .checked
      ).toBe(false);
      expect(
        getByLabelText('Black can castle queen-side').props.accessibilityState
          .checked
      ).toBe(true);
    });

    it('should show "No castling rights available" text when "-"', () => {
      const { getByText } = render(
        <CastlingRightsTogglers
          castlingRights="-"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(getByText('No castling rights available')).toBeTruthy();
    });

    it('should not show "No castling rights available" when rights exist', () => {
      const { queryByText } = render(
        <CastlingRightsTogglers
          castlingRights="K"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(queryByText('No castling rights available')).toBeNull();
    });
  });

  describe('interaction', () => {
    it('should toggle white king-side on', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="-"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      const toggle = getByLabelText('White can castle king-side');
      fireEvent.press(toggle);

      expect(mockOnCastlingChange).toHaveBeenCalledWith('K');
    });

    it('should toggle white king-side off', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="KQkq"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      const toggle = getByLabelText('White can castle king-side');
      fireEvent.press(toggle);

      expect(mockOnCastlingChange).toHaveBeenCalledWith('Qkq');
    });

    it('should toggle multiple rights independently', () => {
      const { getByLabelText, rerender } = render(
        <CastlingRightsTogglers
          castlingRights="-"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      // Toggle white king-side
      const whiteKingSide = getByLabelText('White can castle king-side');
      fireEvent.press(whiteKingSide);
      expect(mockOnCastlingChange).toHaveBeenCalledWith('K');

      // Simulate state update
      rerender(
        <CastlingRightsTogglers
          castlingRights="K"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      // Toggle black queen-side
      const blackQueenSide = getByLabelText('Black can castle queen-side');
      fireEvent.press(blackQueenSide);
      expect(mockOnCastlingChange).toHaveBeenCalledWith('Kq');
    });

    it('should toggle last right to "-"', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="K"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      const toggle = getByLabelText('White can castle king-side');
      fireEvent.press(toggle);

      expect(mockOnCastlingChange).toHaveBeenCalledWith('-');
    });
  });

  describe('accessibility', () => {
    it('should have correct accessibility roles', () => {
      const { getByLabelText } = render(
        <CastlingRightsTogglers
          castlingRights="KQkq"
          onCastlingChange={mockOnCastlingChange}
        />
      );

      expect(
        getByLabelText('White can castle king-side').props.accessibilityRole
      ).toBe('checkbox');
      expect(
        getByLabelText('White can castle queen-side').props.accessibilityRole
      ).toBe('checkbox');
      expect(
        getByLabelText('Black can castle king-side').props.accessibilityRole
      ).toBe('checkbox');
      expect(
        getByLabelText('Black can castle queen-side').props.accessibilityRole
      ).toBe('checkbox');
    });
  });
});
