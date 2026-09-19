import { render } from '@testing-library/react-native';

import PrivacyScreen from '../privacy';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

describe('PrivacyScreen', () => {
  it('explica o processamento local e como apagar a análise', async () => {
    const screen = await render(<PrivacyScreen />);

    expect(screen.getByText('Sua privacidade em primeiro lugar')).toBeTruthy();
    expect(screen.getByText('A análise acontece somente neste aparelho.')).toBeTruthy();
    expect(
      screen.getByText('A área de transferência só é lida quando você toca em colar.'),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Apagar análise atual' })).toBeTruthy();
  });
});
