import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ScreenHeader } from './ScreenHeader';

describe('ScreenHeader', () => {
  it('renders title without back button when onBack is not provided', async () => {
    await render(<ScreenHeader title="Crypto Tracker" />);

    expect(screen.getByText('Crypto Tracker')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull();
  });

  it('renders back button and triggers onBack when pressed', async () => {
    const onBackMock = jest.fn();
    await render(<ScreenHeader title="New Alert" onBack={onBackMock} />);

    expect(screen.getByText('New Alert')).toBeTruthy();
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    expect(backBtn).toBeTruthy();

    fireEvent.press(backBtn);
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });
});

