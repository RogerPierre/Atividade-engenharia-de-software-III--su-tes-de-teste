import { AlertContext, type PriceAlert } from '@context/AlertProvider/useAlertProvider';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { PriceAlertsScreen } from './PriceAlertsScreen';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('PriceAlertsScreen', () => {
  const mockDeleteAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders EmptyState when there are no alerts and handles navigation', async () => {
    await render(
      <AlertContext.Provider
        value={{
          alerts: [],
          addAlert: jest.fn(),
          deleteAlert: mockDeleteAlert,
        }}
      >
        <PriceAlertsScreen />
      </AlertContext.Provider>
    );

    expect(screen.getByText('Price Alerts')).toBeTruthy();
    expect(screen.getByText('No alerts yet')).toBeTruthy();
    expect(
      screen.getByText(
        'Create your first price alert to get notified when a cryptocurrency reaches your target price.'
      )
    ).toBeTruthy();

    // Clicking "Create Alert" button in EmptyState
    const createBtn = screen.getByText('Create Alert');
    fireEvent.press(createBtn);
    expect(router.push).toHaveBeenCalledWith('/alerts/create');

    // Clicking "New Alert" button in header
    const newAlertBtn = screen.getByText('New Alert');
    fireEvent.press(newAlertBtn);
    expect(router.push).toHaveBeenCalledTimes(2);
  });

  it('renders list of alerts and deletes an alert when delete button is pressed', async () => {
    const alerts: PriceAlert[] = [
      {
        id: 'alert-1',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        targetPrice: 70000,
        condition: 'above',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'alert-2',
        cryptocurrency: 'Ethereum',
        symbol: 'ETH',
        targetPrice: 3500,
        condition: 'below',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    await render(
      <AlertContext.Provider
        value={{
          alerts,
          addAlert: jest.fn(),
          deleteAlert: mockDeleteAlert,
        }}
      >
        <PriceAlertsScreen />
      </AlertContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeTruthy();
      expect(screen.getByText('$70,000.00')).toBeTruthy();
      expect(screen.getByText('Ethereum')).toBeTruthy();
      expect(screen.getByText('$3,500.00')).toBeTruthy();
    });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete alert' });
    expect(deleteButtons).toHaveLength(2);

    fireEvent.press(deleteButtons[0]);
    expect(mockDeleteAlert).toHaveBeenCalledTimes(1);
    expect(mockDeleteAlert).toHaveBeenCalledWith('alert-1');
  });
});
