import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders default message "Loading..." when none is provided', async () => {
    await render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders custom message when message prop is provided', async () => {
    await render(<LoadingState message="Fetching crypto prices..." />);

    expect(screen.getByText('Fetching crypto prices...')).toBeTruthy();
  });
});

