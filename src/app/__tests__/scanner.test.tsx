import { fireEvent, render } from '@testing-library/react-native';

import { useAnalysisStore } from '@/state/analysisStore';
import ScannerScreen from '../scanner';

const mockPermission = { granted: false, canAskAgain: true };
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockReact = require('react') as typeof import('react');
const mockView = jest.requireActual('react-native').View;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('expo-camera', () => ({
  CameraView: (props: Record<string, unknown>) =>
    mockReact.createElement(mockView, { testID: 'camera-view', ...props }),
  useCameraPermissions: () => [mockPermission, jest.fn()],
}));

describe('ScannerScreen', () => {
  afterEach(() => {
    mockPermission.granted = false;
    mockPush.mockClear();
    mockReplace.mockClear();
    useAnalysisStore.getState().clearAnalysis();
  });

  it('explica a permissão antes de pedir acesso à câmera', async () => {
    const screen = await render(<ScannerScreen />);

    expect(screen.getByText('Escaneie o QR Code')).toBeTruthy();
    expect(
      screen.getByText('A câmera só será usada nesta etapa e não inicia pagamentos.'),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Permitir câmera' })).toBeTruthy();
  });

  it('permite fechar o scanner quando a câmera está aberta', async () => {
    mockPermission.granted = true;
    const screen = await render(<ScannerScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Fechar scanner' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('mostra confirmação antes de abrir a conferência após ler um QR Code', async () => {
    mockPermission.granted = true;
    const screen = await render(<ScannerScreen />);

    await fireEvent(screen.getByTestId('camera-view'), 'barcodeScanned', {
      data: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913FULANO DE TAL6008BRASILIA62070503***6304ABCD',
    });

    expect(screen.getByText('QR Code encontrado')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Conferir QR Code' })).toBeTruthy();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
