import React from 'react';
import { render } from '@testing-library/react-native';
import { EditableBoard } from '../../components/EditableBoard';
import { DEFAULT_FEN } from '../../utils/fen';

describe('EditableBoard Component', () => {
  const mockOnFenChange = jest.fn();

  beforeEach(() => {
    mockOnFenChange.mockClear();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render starting position pieces', () => {
      const { UNSAFE_getAllByType } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // The board should render multiple views for squares and pieces
      const views = UNSAFE_getAllByType(require('react-native').View);
      expect(views.length).toBeGreaterThan(64); // At least 64 squares plus wrappers
    });

    it('should update when FEN changes', () => {
      const newFen =
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
      const { rerender, toJSON } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      const initialRender = toJSON();

      rerender(<EditableBoard fen={newFen} onFenChange={mockOnFenChange} />);

      const updatedRender = toJSON();

      // The render should be different after FEN change
      expect(updatedRender).not.toEqual(initialRender);
    });

    it('should render with custom square size', () => {
      const { toJSON } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          squareSize={60}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom colors', () => {
      const { toJSON } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          lightSquareColor="#ffffff"
          darkSquareColor="#000000"
        />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('board flipping', () => {
    it('should render flipped board when flipped=true', () => {
      const { toJSON } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          flipped={true}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render normal board when flipped=false', () => {
      const { toJSON } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          flipped={false}
        />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('empty positions', () => {
    it('should render empty board', () => {
      const emptyFen = '8/8/8/8/8/8/8/8 w - - 0 1';
      const { toJSON } = render(
        <EditableBoard fen={emptyFen} onFenChange={mockOnFenChange} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render partial position', () => {
      const partialFen = '8/8/8/8/8/8/4P3/4K3 w - - 0 1';
      const { toJSON } = render(
        <EditableBoard fen={partialFen} onFenChange={mockOnFenChange} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('gesture handling', () => {
    it('should render GestureHandlerRootView', () => {
      const { UNSAFE_getByType } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Should include GestureHandlerRootView (mocked as View)
      const GestureHandlerRootView = require('react-native-gesture-handler').GestureHandlerRootView;
      expect(UNSAFE_getByType(GestureHandlerRootView)).toBeTruthy();
    });
  });

  describe('coordinate labels', () => {
    it('should render coordinate labels by default', () => {
      const { getByText } = render(
        <EditableBoard fen={DEFAULT_FEN} onFenChange={mockOnFenChange} />
      );

      // Check for rank labels (1-8)
      for (let i = 1; i <= 8; i++) {
        expect(getByText(i.toString())).toBeTruthy();
      }

      // Check for file labels (a-h)
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      files.forEach((file) => {
        expect(getByText(file)).toBeTruthy();
      });
    });

    it('should hide coordinate labels when show is false', () => {
      const { queryByText } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          coordinateLabels={{ show: false }}
        />
      );

      // Rank labels should not be present
      expect(queryByText('1')).toBeNull();
      expect(queryByText('8')).toBeNull();

      // File labels should not be present
      expect(queryByText('a')).toBeNull();
      expect(queryByText('h')).toBeNull();
    });

    it('should apply custom styling to coordinate labels', () => {
      const { getByText } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          coordinateLabels={{
            fontSize: 20,
            color: '#FF0000',
            fontWeight: 'bold',
          }}
        />
      );

      const rankLabel = getByText('1');
      expect(rankLabel.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 20,
            color: '#FF0000',
            fontWeight: 'bold',
          }),
        ])
      );

      const fileLabel = getByText('a');
      expect(fileLabel.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 20,
            color: '#FF0000',
            fontWeight: 'bold',
          }),
        ])
      );
    });

    it('should update coordinate labels when board is flipped', () => {
      const { getAllByText } = render(
        <EditableBoard
          fen={DEFAULT_FEN}
          onFenChange={mockOnFenChange}
          flipped={true}
        />
      );

      const rankLabels = getAllByText(/[1-8]/);
      const fileLabels = getAllByText(/[a-h]/);

      // When flipped, rank labels should be from 1 to 8 (top to bottom)
      expect(rankLabels[0].children[0]).toBe('1');
      expect(rankLabels[7].children[0]).toBe('8');

      // When flipped, file labels should be from h to a (left to right)
      expect(fileLabels[0].children[0]).toBe('h');
      expect(fileLabels[7].children[0]).toBe('a');
    });
  });
});
