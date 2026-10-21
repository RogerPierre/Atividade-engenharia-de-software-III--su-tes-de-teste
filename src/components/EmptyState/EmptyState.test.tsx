import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders icon and title correctly', async () => {
    await render(
      <EmptyState
        icon={<Text testID="empty-icon">📭</Text>}
        title="No items found"
      />
    );

    expect(screen.getByTestId('empty-icon')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'No items found' })).toBeTruthy();
    expect(screen.queryByText('Some description')).toBeNull();
  });

  it('renders optional description and action component', async () => {
    await render(
      <EmptyState
        icon={<Text>Icon</Text>}
        title="No alerts yet"
        description="Create your first alert to stay informed"
        action={<Text testID="action-btn">Create Alert</Text>}
      />
    );

    expect(screen.getByText('No alerts yet')).toBeTruthy();
    expect(
      screen.getByText('Create your first alert to stay informed')
    ).toBeTruthy();
    expect(screen.getByTestId('action-btn')).toBeTruthy();
  });
});

