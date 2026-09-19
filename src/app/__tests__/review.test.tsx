import { act, render } from '@testing-library/react-native';

import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { useAnalysisStore } from '@/state/analysisStore';
import ReviewScreen from '../review';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

describe('ReviewScreen', () => {
  afterEach(async () => {
    await act(async () => {
      useAnalysisStore.getState().clearAnalysis();
    });
  });

  it('exibe beneficiário, valor e cidade encontrados no QR Code Pix', async () => {
    useAnalysisStore.getState().setAnalysis(
      analyzeInput(
        '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913FULANO DE TAL6008BRASILIA62070503***6304ABCD',
        'qrCode',
      ),
    );

    const screen = await render(<ReviewScreen />);

    expect(screen.getByText('FULANO DE TAL')).toBeTruthy();
    expect(screen.getByText('R$ 10,00')).toBeTruthy();
    expect(screen.getByText('BRASILIA')).toBeTruthy();
  });
});
