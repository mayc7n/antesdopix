import { Alert } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import HomeScreen from '../index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('HomeScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('apresenta a ação principal e as quatro formas de conferir algo suspeito', async () => {
    const screen = await render(<HomeScreen />);

    expect(
      screen.getByText(
        'Recebeu algo suspeito? Cole, compartilhe ou escaneie antes de pagar.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Colar mensagem' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Como compartilhar' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Inserir link, telefone ou chave Pix' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Escanear QR Code' })).toBeTruthy();
  });

  it('explica como enviar uma mensagem de outro aplicativo', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const screen = await render(<HomeScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Como compartilhar' }));

    expect(alertSpy).toHaveBeenCalledWith(
      'Como compartilhar',
      expect.stringContaining('selecione Antes do Pix'),
    );
  });
});
