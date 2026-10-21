import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ConversionScreen } from './ConversionScreen';

describe('ConversionScreen', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Use fallback'));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders initial state with "Enter an amount" placeholder', async () => {
    await render(<ConversionScreen />);

    expect(screen.getByText('Convert Crypto')).toBeTruthy();
    expect(screen.getByPlaceholderText('0.00')).toBeTruthy();
    expect(screen.getByText('Enter an amount')).toBeTruthy();
  });

  it('calculates converted amount correctly when a valid amount is entered', async () => {
    await render(<ConversionScreen />);

    const input = screen.getByPlaceholderText('0.00');
    // 2 Bitcoins (price 67999.5) in USD (rate 1) = 135,999.00
    fireEvent.changeText(input, '2');

    await waitFor(() => {
      expect(screen.getByText('$135,999.00')).toBeTruthy();
    });
  });

  it('displays "Invalid amount" when invalid or negative number is typed', async () => {
    await render(<ConversionScreen />);

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.changeText(input, '-10');

    await waitFor(() => {
      expect(screen.getByText('Invalid amount')).toBeTruthy();
    });

    fireEvent.changeText(input, 'not-a-number');
    await waitFor(() => {
      expect(screen.getByText('Invalid amount')).toBeTruthy();
    });
  });
});

