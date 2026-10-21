import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders default title and message when none are provided', async () => {
    await render(<ErrorState />);

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(
      screen.getByText("We couldn't load the data. Please try again.")
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
  });

  it('renders custom title and message', async () => {
    await render(
      <ErrorState
        title="Network Error"
        message="Unable to reach the server."
      />
    );

    expect(screen.getByText('Network Error')).toBeTruthy();
    expect(screen.getByText('Unable to reach the server.')).toBeTruthy();
  });

  it('renders retry button and calls onRetry when pressed', async () => {
    const onRetryMock = jest.fn();
    await render(<ErrorState onRetry={onRetryMock} />);

    const retryBtn = screen.getByRole('button', { name: 'Retry' });
    expect(retryBtn).toBeTruthy();

    fireEvent.press(retryBtn);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});

