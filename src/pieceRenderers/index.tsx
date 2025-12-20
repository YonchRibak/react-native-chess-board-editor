import React from 'react';
import { pieceRendererRegistry } from '../utils/pieceRendererRegistry';
import { UnicodePiece } from '../components/pieces/UnicodePiece';
import { SvgPiece } from '../components/pieces/SvgPiece';
import { renderCburnettPiece } from '../assets/pieces/cburnett';
import { renderAlphaPiece } from '../assets/pieces/alpha';
import type { PieceSymbol } from '../types';

/**
 * Initialize built-in piece set renderers
 * This runs when the library is imported
 */

// Register Unicode renderer
pieceRendererRegistry.registerPieceSet('unicode', {
  type: 'unicode',
  render: (piece: PieceSymbol, size: number, style?) => (
    <UnicodePiece piece={piece} size={size} style={style} />
  ),
});

// Register CBurnett SVG renderer
pieceRendererRegistry.registerPieceSet('cburnett', {
  type: 'svg',
  render: (piece: PieceSymbol, size: number, style?) => (
    <SvgPiece style={style}>{renderCburnettPiece(piece, size)}</SvgPiece>
  ),
});

// Register Alpha SVG renderer
pieceRendererRegistry.registerPieceSet('alpha', {
  type: 'svg',
  render: (piece: PieceSymbol, size: number, style?) => (
    <SvgPiece style={style}>{renderAlphaPiece(piece, size)}</SvgPiece>
  ),
});
