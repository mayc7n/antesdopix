import { render } from '@testing-library/react-native';

import { AppButton } from '../AppButton';

describe('AppButton', () => {
  it('não adiciona um espaçador quando o botão não tem ícone', async () => {
    const screen = await render(
      <AppButton label="Voltar" variant="quiet" onPress={() => undefined} />,
    );

    expect(screen.getByRole('button', { name: 'Voltar' }).children).toHaveLength(1);
  });
});
