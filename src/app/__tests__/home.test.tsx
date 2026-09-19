import { Alert } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';

import { useAnalysisStore } from '@/state/analysisStore';
import HomeScreen from '../index';

jest.mock('expo-clipboard', () => ({
  getStringAsync: jest.fn(),
  setStringAsync: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('HomeScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockPush.mockClear();
    useAnalysisStore.getState().clearAnalysis();
  });

  it('apresenta a ação principal e as quatro formas de conferir algo suspeito', async () => {
    const screen = await render(<HomeScreen />);

    expect(
      screen.getByText(
        'Recebeu algo suspeito? Cole, compartilhe ou escaneie antes de pagar.',
      ),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Colar da área de transferência' })).toBeTruthy();
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

  it('cola conteúdo da área de transferência e encaminha para conferência', async () => {
    jest.spyOn(Clipboard, 'getStringAsync').mockResolvedValue('Pague agora para resgatar seu prêmio.');
    const screen = await render(<HomeScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Colar da área de transferência' }));

    expect(mockPush).toHaveBeenCalledWith('/review');
    expect(useAnalysisStore.getState().currentAnalysis?.input.origin).toBe('colar');
  });

  it('explica quando a área de transferência está vazia', async () => {
    jest.spyOn(Clipboard, 'getStringAsync').mockResolvedValue('   ');
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const screen = await render(<HomeScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Colar da área de transferência' }));

    expect(alertSpy).toHaveBeenCalledWith(
      'Área de transferência vazia',
      expect.stringContaining('Copie uma mensagem'),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
