import { render } from '@testing-library/react-native';

import { RiskBadge } from '../RiskBadge';

describe('RiskBadge', () => {
  it('orienta a pessoa a conferir os sinais antes de pagar', async () => {
    const screen = await render(<RiskBadge level="atencao" />);

    expect(
      screen
        .getAllByRole('text')
        .some(
          (element) =>
            element.props.accessibilityHint ===
            'Confira os sinais antes de pagar.',
        ),
    ).toBe(true);
  });
});
