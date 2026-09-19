import { fireEvent, render } from '@testing-library/react-native';

import ManualScreen from '../manual';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ManualScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('analisa o texto digitado e encaminha para a conferência', async () => {
    const screen = await render(<ManualScreen />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('Cole aqui a mensagem, link ou chave Pix'),
      'Pague agora para resgatar seu prêmio.',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Analisar agora' }));

    expect(mockPush).toHaveBeenCalledWith('/review');
  });

  it('pede uma entrada antes de analisar', async () => {
    const screen = await render(<ManualScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Analisar agora' }));

    expect(screen.getByText('Cole ou digite algo para conferir.')).toBeTruthy();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('permite limpar o conteúdo digitado', async () => {
    const screen = await render(<ManualScreen />);
    const input = screen.getByPlaceholderText('Cole aqui a mensagem, link ou chave Pix');

    await fireEvent.changeText(input, 'Mensagem para conferir');
    expect(screen.getByRole('button', { name: 'Limpar campo' })).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Limpar campo' }));

    expect(screen.getByDisplayValue('')).toBeTruthy();
    expect(screen.getByText('0/5000')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Limpar campo' })).toBeNull();
  });

  it('remove o erro ao limpar uma entrada depois de uma tentativa vazia', async () => {
    const screen = await render(<ManualScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Analisar agora' }));
    expect(screen.getByText('Cole ou digite algo para conferir.')).toBeTruthy();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Cole aqui a mensagem, link ou chave Pix'),
      'Mensagem para conferir',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Limpar campo' }));

    expect(screen.queryByText('Cole ou digite algo para conferir.')).toBeNull();
  });
});
