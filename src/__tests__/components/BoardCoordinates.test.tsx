import React from 'react';
import { render } from '@testing-library/react-native';
import { RankLabels, FileLabels } from '../../components/BoardCoordinates';

describe('RankLabels', () => {
  const defaultProps = {
    squareSize: 50,
    flipped: false,
  };

  it('renders all rank labels (1-8)', () => {
    const { getByText } = render(<RankLabels {...defaultProps} />);

    for (let i = 1; i <= 8; i++) {
      expect(getByText(i.toString())).toBeTruthy();
    }
  });

  it('renders rank labels in correct order when not flipped', () => {
    const { getAllByText } = render(<RankLabels {...defaultProps} />);
    const labels = getAllByText(/[1-8]/);

    // When not flipped, ranks should be from 8 to 1 (top to bottom)
    expect(labels[0].children[0]).toBe('8');
    expect(labels[7].children[0]).toBe('1');
  });

  it('renders rank labels in reverse order when flipped', () => {
    const { getAllByText } = render(
      <RankLabels {...defaultProps} flipped={true} />
    );
    const labels = getAllByText(/[1-8]/);

    // When flipped, ranks should be from 1 to 8 (top to bottom)
    expect(labels[0].children[0]).toBe('1');
    expect(labels[7].children[0]).toBe('8');
  });

  it('applies custom styling from config', () => {
    const config = {
      fontSize: 20,
      color: '#FF0000',
      fontWeight: 'bold' as const,
    };

    const { getByText } = render(
      <RankLabels {...defaultProps} config={config} />
    );

    const label = getByText('1');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 20,
          color: '#FF0000',
          fontWeight: 'bold',
        }),
      ])
    );
  });

  it('uses default fontSize when not specified', () => {
    const { getByText } = render(<RankLabels {...defaultProps} />);

    const label = getByText('1');
    // Default fontSize should be squareSize * 0.2 = 50 * 0.2 = 10
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 10,
        }),
      ])
    );
  });
});

describe('FileLabels', () => {
  const defaultProps = {
    squareSize: 50,
    flipped: false,
    rankLabelWidth: 20,
  };

  it('renders all file labels (a-h)', () => {
    const { getByText } = render(<FileLabels {...defaultProps} />);

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    files.forEach((file) => {
      expect(getByText(file)).toBeTruthy();
    });
  });

  it('renders file labels in correct order when not flipped', () => {
    const { getAllByText } = render(<FileLabels {...defaultProps} />);
    const labels = getAllByText(/[a-h]/);

    // When not flipped, files should be from a to h (left to right)
    expect(labels[0].children[0]).toBe('a');
    expect(labels[7].children[0]).toBe('h');
  });

  it('renders file labels in reverse order when flipped', () => {
    const { getAllByText } = render(
      <FileLabels {...defaultProps} flipped={true} />
    );
    const labels = getAllByText(/[a-h]/);

    // When flipped, files should be from h to a (left to right)
    expect(labels[0].children[0]).toBe('h');
    expect(labels[7].children[0]).toBe('a');
  });

  it('applies custom styling from config', () => {
    const config = {
      fontSize: 16,
      color: '#0000FF',
      fontFamily: 'Arial',
    };

    const { getByText } = render(
      <FileLabels {...defaultProps} config={config} />
    );

    const label = getByText('a');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          color: '#0000FF',
          fontFamily: 'Arial',
        }),
      ])
    );
  });

  it('uses default fontSize when not specified', () => {
    const { getByText } = render(<FileLabels {...defaultProps} />);

    const label = getByText('a');
    // Default fontSize should be squareSize * 0.2 = 50 * 0.2 = 10
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 10,
        }),
      ])
    );
  });

  it('uses default color when not specified', () => {
    const { getByText } = render(<FileLabels {...defaultProps} />);

    const label = getByText('a');
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: '#666',
        }),
      ])
    );
  });
});
