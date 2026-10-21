import React from 'react';
import { Text, Pressable } from 'react-native';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertProvider } from './AlertProvider';
import { useAlerts } from './useAlertProvider';

const STORAGE_KEY = 'cryptoAlerts';

function TestConsumer() {
  const { alerts, addAlert, deleteAlert } = useAlerts();

  return (
    <>
      <Text testID="alert-count">{alerts.length}</Text>
      {alerts.map((alert) => (
        <Pressable
          key={alert.id}
          testID={`delete-btn-${alert.id}`}
          onPress={() => deleteAlert(alert.id)}
        >
          <Text testID={`alert-item-${alert.id}`}>{`${alert.cryptocurrency}-${alert.targetPrice}`}</Text>
        </Pressable>
      ))}
      <Pressable
        testID="add-btn"
        onPress={() =>
          addAlert({
            cryptocurrency: 'Bitcoin',
            symbol: 'BTC',
            targetPrice: 65000,
            condition: 'above',
          })
        }
      >
        <Text>Add Alert</Text>
      </Pressable>
    </>
  );
}

describe('AlertProvider and useAlerts', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('throws an error when useAlerts is called outside of AlertProvider', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderHook(() => useAlerts())).rejects.toThrow(
      'useAlerts must be used within AlertProvider'
    );
    consoleError.mockRestore();
  });

  it('hydrates saved alerts from AsyncStorage on mount', async () => {
    const existingAlerts = [
      {
        id: '123-abc',
        cryptocurrency: 'Ethereum',
        symbol: 'ETH',
        targetPrice: 4000,
        condition: 'above' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingAlerts));

    await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-count').props.children).toBe(1);
      expect(screen.getByTestId('alert-item-123-abc')).toBeTruthy();
    });
  });

  it('adds an alert, updates context state, and persists to AsyncStorage', async () => {
    await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-count').props.children).toBe(0);
    });

    fireEvent.press(screen.getByTestId('add-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('alert-count').props.children).toBe(1);
    });

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].symbol).toBe('BTC');
      expect(parsed[0].targetPrice).toBe(65000);
      expect(parsed[0].condition).toBe('above');
      expect(parsed[0].id).toBeDefined();
      expect(parsed[0].createdAt).toBeDefined();
    });
  });

  it('deletes an alert and updates AsyncStorage', async () => {
    const existingAlerts = [
      {
        id: 'alert-to-delete',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        targetPrice: 65000,
        condition: 'above' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingAlerts));

    await render(
      <AlertProvider>
        <TestConsumer />
      </AlertProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-count').props.children).toBe(1);
    });

    fireEvent.press(screen.getByTestId('delete-btn-alert-to-delete'));

    await waitFor(() => {
      expect(screen.getByTestId('alert-count').props.children).toBe(0);
    });

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      expect(stored).toBe('[]');
    });
  });
});
