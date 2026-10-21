import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CryptoCard } from '@components/CryptoCard/CryptoCard';
import { AlertProvider } from '@context/AlertProvider/AlertProvider';

describe('CryptoCard test', () => {
  it('renders crypto details', async () => {
    const crypto = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 67999.5,
      change24h: 2.45,
    };

    await render(
      <AlertProvider>
        <CryptoCard crypto={crypto} />
      </AlertProvider>
    );

    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByText('BTC')).toBeTruthy();
    expect(screen.getByText('$67,999.50')).toBeTruthy();
    expect(screen.getByText('+2.45%')).toBeTruthy();
  });
});
