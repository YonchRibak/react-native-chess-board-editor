import React from 'react';
import { render } from '@testing-library/react-native';
import { Piece } from '../../components/Piece';
import type { PieceSymbol } from '../../types';
import { PIECE_UNICODE } from '../../utils/constants';

describe('Piece Component', () => {
  describe('rendering', () => {
    it('should render white pawn', () => {
      const { getByText } = render(<Piece piece="P" />);
      expect(getByText(PIECE_UNICODE.P)).toBeTruthy();
    });

    it('should render black pawn', () => {
      const { getByText } = render(<Piece piece="p" />);
      expect(getByText(PIECE_UNICODE.p)).toBeTruthy();
    });

    it('should render all white pieces', () => {
      const whitePieces: PieceSymbol[] = ['P', 'N', 'B', 'R', 'Q', 'K'];

      whitePieces.forEach((piece) => {
        const { getByText } = render(<Piece piece={piece} />);
        expect(getByText(PIECE_UNICODE[piece])).toBeTruthy();
      });
    });

    it('should render all black pieces', () => {
      const blackPieces: PieceSymbol[] = ['p', 'n', 'b', 'r', 'q', 'k'];

      blackPieces.forEach((piece) => {
        const { getByText } = render(<Piece piece={piece} />);
        expect(getByText(PIECE_UNICODE[piece])).toBeTruthy();
      });
    });
  });

  describe('styling', () => {
    it('should apply custom size', () => {
      const { getByText } = render(<Piece piece="P" size={50} />);
      const piece = getByText(PIECE_UNICODE.P);

      expect(piece.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 50,
            lineHeight: 60,
          }),
        ])
      );
    });

    it('should apply custom style', () => {
      const customStyle = { color: 'red' };
      const { getByText } = render(<Piece piece="P" style={customStyle} />);
      const piece = getByText(PIECE_UNICODE.P);

      expect(piece.props.style).toEqual(expect.arrayContaining([customStyle]));
    });

    it('should use default size when not specified', () => {
      const { getByText } = render(<Piece piece="P" />);
      const piece = getByText(PIECE_UNICODE.P);

      expect(piece.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 40,
            lineHeight: 48,
          }),
        ])
      );
    });
  });
});
