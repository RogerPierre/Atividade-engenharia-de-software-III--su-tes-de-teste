import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { CreateAlertScreen } from './CreateAlertScreen';
import { AlertContext } from '@context/AlertProvider/useAlertProvider';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

describe('CreateAlertScreen', () => {
  const mockAddAlert = jest.fn();

  const renderWithContext = async () => {
    return await render(
      <AlertContext.Provider
        value={{
          alerts: [],
          addAlert: mockAddAlert,
          deleteAlert: jest.fn(),
        }}
      >
        <CreateAlertScreen />
      </AlertContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header, input fields and disabled save button initially', async () => {
    await renderWithContext();

    expect(screen.getByText('Create Alert')).toBeTruthy();
    expect(screen.getByText('Target Price (USD)')).toBeTruthy();
    expect(screen.getByPlaceholderText('0.00')).toBeTruthy();
    expect(screen.getByText('Alert Condition')).toBeTruthy();

    const saveBtn = screen.getByRole('button', { name: 'Save Alert' });
    expect(saveBtn.props.accessibilityState).toEqual({ disabled: true });
  });

  it('calls router.back when back button is pressed', async () => {
    await renderWithContext();

    const backBtn = screen.getByRole('button', { name: 'Go back' });
    fireEvent.press(backBtn);

    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('selects crypto, enters target price, changes condition, and submits alert', async () => {
    await renderWithContext();

    // 1. Open select cryptocurrency modal
    fireEvent.press(screen.getByText('Select cryptocurrency'));

    // 2. Select Bitcoin
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Bitcoin'));

    // 3. Enter target price
    const priceInput = screen.getByPlaceholderText('0.00');
    fireEvent.changeText(priceInput, '75000');

    // 4. Change condition to "below"
    const belowCondition = screen.getByText('Below target price');
    fireEvent.press(belowCondition);

    // 5. Button should now be enabled
    await waitFor(() => {
      const saveBtn = screen.getByRole('button', { name: 'Save Alert' });
      expect(saveBtn.props.accessibilityState?.disabled).toBe(false);
    });

    // 6. Press Save Alert
    const saveBtn = screen.getByRole('button', { name: 'Save Alert' });
    fireEvent.press(saveBtn);

    expect(mockAddAlert).toHaveBeenCalledTimes(1);
    expect(mockAddAlert).toHaveBeenCalledWith({
      cryptocurrency: 'Bitcoin',
      symbol: 'BTC',
      targetPrice: 75000,
      condition: 'below',
    });
    expect(router.replace).toHaveBeenCalledWith('/alerts');
  });
});

