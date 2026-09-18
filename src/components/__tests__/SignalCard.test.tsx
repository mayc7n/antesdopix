import { render } from '@testing-library/react-native';

import { SignalCard } from '../SignalCard';

describe('SignalCard', () => {
  it('expõe título e explicação como uma descrição única', async () => {
    const screen = await render(
      <SignalCard
        signal={{
          code: 'urgencia',
          severity: 'media',
          title: 'A mensagem cria pressão',
          explanation: 'Confira os dados antes de pagar.',
        }}
      />,
    );

    expect(
      screen
        .getAllByRole('text')
        .some(
          (element) =>
            element.props.accessibilityLabel ===
            'A mensagem cria pressão. Confira os dados antes de pagar.',
        ),
    ).toBe(true);
  });
});
