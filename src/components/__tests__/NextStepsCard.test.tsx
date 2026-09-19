import { render } from '@testing-library/react-native';

import { NextStepsCard } from '../NextStepsCard';

describe('NextStepsCard', () => {
  it('exibe o título e cada próximo passo', async () => {
    const screen = await render(
      <NextStepsCard
        steps={[
          { title: 'Pare agora', description: 'Não faça o pagamento.' },
          { title: 'Confirme', description: 'Procure um canal oficial.' },
        ]}
      />,
    );

    expect(screen.getByText('O que fazer agora')).toBeTruthy();
    expect(screen.getByText('Não faça o pagamento.')).toBeTruthy();
    expect(screen.getByText('Procure um canal oficial.')).toBeTruthy();
  });
});
