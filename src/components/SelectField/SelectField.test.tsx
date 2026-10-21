import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SelectField } from './SelectField';

describe('SelectField', () => {
  const mockOptions = [
    { value: 'btc', title: 'Bitcoin', subtitle: 'BTC' },
    { value: 'eth', title: 'Ethereum', subtitle: 'ETH' },
    { value: 'sol', title: 'Solana', subtitle: 'SOL' },
  ];

  it('renders label and placeholder when no value is selected', async () => {
    await render(
      <SelectField
        label="Select Currency"
        placeholder="Choose a coin"
        options={mockOptions}
        value=""
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Select Currency')).toBeTruthy();
    expect(screen.getByText('Choose a coin')).toBeTruthy();
  });

  it('displays the selected option title when value is matched', async () => {
    await render(
      <SelectField
        label="Select Currency"
        options={mockOptions}
        value="eth"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Ethereum (ETH)')).toBeTruthy();
  });

  it('opens modal on press, selects an option, and calls onChange', async () => {
    const onChangeMock = jest.fn();
    await render(
      <SelectField
        label="Select Currency"
        options={mockOptions}
        value="btc"
        onChange={onChangeMock}
      />
    );

    const fieldBtn = screen.getByRole('button');
    fireEvent.press(fieldBtn);

    await waitFor(() => {
      expect(screen.getByText('Solana')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Solana'));
    expect(onChangeMock).toHaveBeenCalledWith('sol');
  });

  it('closes modal when backdrop is pressed', async () => {
    await render(
      <SelectField
        label="Select Currency"
        options={mockOptions}
        value=""
        onChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Close'));
  });
});

