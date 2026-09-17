import { render } from '@testing-library/react-native';

import HomeScreen from '../index';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('HomeScreen', () => {
  it('apresenta a ação principal e as quatro formas de conferir algo suspeito', async () => {
    const screen = await render(<HomeScreen />);

    expect(
      screen.getByText(
        'Recebeu algo suspeito? Cole, compartilhe ou escaneie antes de pagar.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Colar mensagem' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Compartilhar mensagem' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Inserir link, telefone ou chave Pix' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Escanear QR Code' })).toBeTruthy();
  });
});
