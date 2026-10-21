import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CryptoCard } from './CryptoCard';
import { AlertProvider } from '@context/AlertProvider/AlertProvider';
import type { Cryptocurrency } from '@data/cryptoData';

const STORAGE_KEY = 'cryptoAlerts';

describe('CryptoCard', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  const bitcoin: Cryptocurrency = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 67999.5,
    change24h: 2.45,
    image: 'https://example.com/btc.png',
  };

  const ripple: Cryptocurrency = {
    id: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    price: 0.52,
    change24h: -1.23,
    // no image to test fallback avatar letter
  };

  it('renders crypto details with image and positive change', async () => {
    await render(
      <AlertProvider>
        <CryptoCard crypto={bitcoin} />
      </AlertProvider>
    );

    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByText('BTC')).toBeTruthy();
    expect(screen.getByText('$67,999.50')).toBeTruthy();
    expect(screen.getByText('+2.45%')).toBeTruthy();
  });

  it('renders fallback symbol initial when image is not provided and negative change', async () => {
    await render(
      <AlertProvider>
        <CryptoCard crypto={ripple} />
      </AlertProvider>
    );

    expect(screen.getByText('Ripple')).toBeTruthy();
    expect(screen.getByText('XRP')).toBeTruthy();
    expect(screen.getByText('X')).toBeTruthy(); // initial letter of XRP
    expect(screen.getByText('$0.52')).toBeTruthy();
    expect(screen.getByText('-1.23%')).toBeTruthy();
  });

  it('shows alert badge when alerts exist for the cryptocurrency', async () => {
    const existingAlerts = [
      {
        id: 'a1',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        targetPrice: 70000,
        condition: 'above' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingAlerts));

    await render(
      <AlertProvider>
        <CryptoCard crypto={bitcoin} />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('1 alert')).toBeTruthy();
    });
  });

  it('toggles expansion of alerts when badge is pressed', async () => {
    const existingAlerts = [
      {
        id: 'a1',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        targetPrice: 70000,
        condition: 'above' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'a2',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        targetPrice: 60000,
        condition: 'below' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingAlerts));

    await render(
      <AlertProvider>
        <CryptoCard crypto={bitcoin} />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2 alerts')).toBeTruthy();
    });

    // Alert items should not be visible before expanding
    expect(screen.queryByText('Above target')).toBeNull();

    // Press badge to expand
    const badge = screen.getByRole('button', {
      name: 'Toggle alerts for this cryptocurrency',
    });
    fireEvent.press(badge);

    await waitFor(() => {
      expect(screen.getByText('Above target')).toBeTruthy();
      expect(screen.getByText('$70,000.00')).toBeTruthy();
      expect(screen.getByText('Below target')).toBeTruthy();
      expect(screen.getByText('$60,000.00')).toBeTruthy();
    });

    // Press badge again to collapse
    fireEvent.press(badge);
    await waitFor(() => {
      expect(screen.queryByText('Above target')).toBeNull();
    });
  });
});

