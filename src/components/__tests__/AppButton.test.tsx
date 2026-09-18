import { render } from '@testing-library/react-native';

import { AppButton } from '../AppButton';

describe('AppButton', () => {
  it('não adiciona um espaçador quando o botão não tem ícone', async () => {
    const screen = await render(
      <AppButton label="Voltar" variant="quiet" onPress={() => undefined} />,
    );

    expect(screen.getByRole('button', { name: 'Voltar' }).children).toHaveLength(1);
  });

  it('expõe uma dica opcional para tecnologias assistivas', async () => {
    const screen = await render(
      <AppButton
        label="Voltar"
        accessibilityHint="Retorna para a tela anterior"
        variant="quiet"
        onPress={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Voltar' }).props.accessibilityHint).toBe(
      'Retorna para a tela anterior',
    );
  });
});
