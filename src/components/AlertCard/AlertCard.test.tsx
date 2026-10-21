import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AlertCard } from './AlertCard';
import type { PriceAlert } from '@context/AlertProvider/useAlertProvider';

describe('AlertCard', () => {
  const mockAlertAbove: PriceAlert = {
    id: 'alert-1',
    cryptocurrency: 'Bitcoin',
    symbol: 'BTC',
    targetPrice: 70000,
    condition: 'above',
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  const mockAlertBelow: PriceAlert = {
    id: 'alert-2',
    cryptocurrency: 'Ethereum',
    symbol: 'ETH',
    targetPrice: 3000.5,
    condition: 'below',
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  it('renders alert details correctly for "above" condition', async () => {
    const onDeleteMock = jest.fn();
    await render(<AlertCard alert={mockAlertAbove} onDelete={onDeleteMock} />);

    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByText('above')).toBeTruthy();
    expect(screen.getByText('$70,000.00')).toBeTruthy();
  });

  it('renders alert details correctly for "below" condition', async () => {
    const onDeleteMock = jest.fn();
    await render(<AlertCard alert={mockAlertBelow} onDelete={onDeleteMock} />);

    expect(screen.getByText('Ethereum')).toBeTruthy();
    expect(screen.getByText('below')).toBeTruthy();
    expect(screen.getByText('$3,000.50')).toBeTruthy();
  });

  it('calls onDelete with alert id when delete button is pressed', async () => {
    const onDeleteMock = jest.fn();
    await render(<AlertCard alert={mockAlertAbove} onDelete={onDeleteMock} />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete alert' });
    fireEvent.press(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith('alert-1');
  });
});

