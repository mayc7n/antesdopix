import { render } from '@testing-library/react-native';

import ScannerScreen from '../scanner';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: () => [
    { granted: false, canAskAgain: true },
    jest.fn(),
  ],
}));

describe('ScannerScreen', () => {
  it('explica a permissão antes de pedir acesso à câmera', async () => {
    const screen = await render(<ScannerScreen />);

    expect(screen.getByText('Escaneie o QR Code')).toBeTruthy();
    expect(
      screen.getByText('A câmera só será usada nesta etapa e não inicia pagamentos.'),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Permitir câmera' })).toBeTruthy();
  });
});
