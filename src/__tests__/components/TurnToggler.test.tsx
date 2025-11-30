import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TurnToggler } from '../../components/TurnToggler';

describe('TurnToggler Component', () => {
  const mockOnTurnChange = jest.fn();

  beforeEach(() => {
    mockOnTurnChange.mockClear();
  });

  describe('rendering', () => {
    it('should render turn toggler with white active', () => {
      const { getByText, getByLabelText } = render(
        <TurnToggler turn="w" onTurnChange={mockOnTurnChange} />
      );

      expect(getByText('Turn:')).toBeTruthy();
      expect(getByText('White')).toBeTruthy();
      expect(getByText('Black')).toBeTruthy();

      const whiteButton = getByLabelText('White to move');
      expect(whiteButton.props.accessibilityState.checked).toBe(true);

      const blackButton = getByLabelText('Black to move');
      expect(blackButton.props.accessibilityState.checked).toBe(false);
    });

    it('should render turn toggler with black active', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="b" onTurnChange={mockOnTurnChange} />
      );

      const whiteButton = getByLabelText('White to move');
      expect(whiteButton.props.accessibilityState.checked).toBe(false);

      const blackButton = getByLabelText('Black to move');
      expect(blackButton.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('interaction', () => {
    it('should call onTurnChange with "w" when white is pressed', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="b" onTurnChange={mockOnTurnChange} />
      );

      const whiteButton = getByLabelText('White to move');
      fireEvent.press(whiteButton);

      expect(mockOnTurnChange).toHaveBeenCalledWith('w');
      expect(mockOnTurnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTurnChange with "b" when black is pressed', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="w" onTurnChange={mockOnTurnChange} />
      );

      const blackButton = getByLabelText('Black to move');
      fireEvent.press(blackButton);

      expect(mockOnTurnChange).toHaveBeenCalledWith('b');
      expect(mockOnTurnChange).toHaveBeenCalledTimes(1);
    });

    it('should allow pressing same turn again', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="w" onTurnChange={mockOnTurnChange} />
      );

      const whiteButton = getByLabelText('White to move');
      fireEvent.press(whiteButton);

      expect(mockOnTurnChange).toHaveBeenCalledWith('w');
    });
  });

  describe('accessibility', () => {
    it('should have correct accessibility roles', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="w" onTurnChange={mockOnTurnChange} />
      );

      const whiteButton = getByLabelText('White to move');
      expect(whiteButton.props.accessibilityRole).toBe('radio');

      const blackButton = getByLabelText('Black to move');
      expect(blackButton.props.accessibilityRole).toBe('radio');
    });

    it('should have correct accessibility labels', () => {
      const { getByLabelText } = render(
        <TurnToggler turn="w" onTurnChange={mockOnTurnChange} />
      );

      expect(getByLabelText('White to move')).toBeTruthy();
      expect(getByLabelText('Black to move')).toBeTruthy();
    });
  });
});
