import { render } from '@testing-library/react-native';

import { AppButton, getAppButtonStyles } from '../AppButton';

const mockReducedMotion = jest.fn(() => false);

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockReducedMotion(),
}));

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

  it('remove a escala do pressed-state quando redução de movimento está ativa', async () => {
    const style = getAppButtonStyles({
      variant: 'primary',
      pressed: true,
      disabled: false,
      reducedMotion: true,
    });

    expect(JSON.stringify(style)).not.toContain('transform');
    expect(
      JSON.stringify(
        getAppButtonStyles({
          variant: 'primary',
          pressed: true,
          disabled: false,
          reducedMotion: false,
        }),
      ),
    ).toContain('transform');
  });
});
