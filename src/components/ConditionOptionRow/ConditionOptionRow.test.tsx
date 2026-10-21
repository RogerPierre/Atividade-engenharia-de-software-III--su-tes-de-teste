import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConditionOptionRow } from './ConditionOptionRow';

describe('ConditionOptionRow', () => {
  it('renders title and subtitle correctly', async () => {
    await render(
      <ConditionOptionRow
        value="above"
        selected={false}
        title="Price rises above"
        subtitle="Get alerted when the price exceeds your target"
        variant="above"
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Price rises above')).toBeTruthy();
    expect(
      screen.getByText('Get alerted when the price exceeds your target')
    ).toBeTruthy();
  });

  it('indicates selected state correctly in accessibilityState', async () => {
    await render(
      <ConditionOptionRow
        value="above"
        selected={true}
        title="Price rises above"
        subtitle="Above description"
        variant="above"
        onSelect={jest.fn()}
      />
    );

    const radio = screen.getByRole('radio');
    expect(radio.props.accessibilityState).toEqual({ selected: true });
  });

  it('triggers onSelect with value when pressed', async () => {
    const onSelectMock = jest.fn();
    await render(
      <ConditionOptionRow
        value="below"
        selected={false}
        title="Price drops below"
        subtitle="Below description"
        variant="below"
        onSelect={onSelectMock}
      />
    );

    fireEvent.press(screen.getByRole('radio'));
    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith('below');
  });
});

