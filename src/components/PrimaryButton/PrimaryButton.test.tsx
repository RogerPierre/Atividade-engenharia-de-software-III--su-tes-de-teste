import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders button label correctly', async () => {
    await render(<PrimaryButton label="Submit Alert" onPress={jest.fn()} />);

    expect(screen.getByText('Submit Alert')).toBeTruthy();
  });

  it('triggers onPress callback when pressed', async () => {
    const onPressMock = jest.fn();
    await render(<PrimaryButton label="Click Me" onPress={onPressMock} />);

    fireEvent.press(screen.getByRole('button', { name: 'Click Me' }));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onPress callback when disabled', async () => {
    const onPressMock = jest.fn();
    await render(
      <PrimaryButton label="Disabled Button" onPress={onPressMock} disabled />
    );

    fireEvent.press(screen.getByRole('button', { name: 'Disabled Button' }));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders optional left icon when provided', async () => {
    await render(
      <PrimaryButton
        label="With Icon"
        onPress={jest.fn()}
        leftIcon={<Text testID="custom-icon">★</Text>}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeTruthy();
    expect(screen.getByText('With Icon')).toBeTruthy();
  });
});

