import { act, render } from '@testing-library/react-native';

import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { useAnalysisStore } from '@/state/analysisStore';
import ResultScreen from '../result';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

describe('ResultScreen', () => {
  afterEach(async () => {
    await act(async () => {
      useAnalysisStore.getState().clearAnalysis();
    });
  });

  it('oferece compartilhamento do resumo sem incluir a mensagem original', async () => {
    useAnalysisStore
      .getState()
      .setAnalysis(analyzeInput('Pague agora para resgatar seu prêmio.', 'manual'));

    const screen = await render(<ResultScreen />);

    expect(screen.getByRole('button', { name: 'Compartilhar resumo' })).toBeTruthy();
    expect(screen.queryByText('Pague agora para resgatar seu prêmio.')).toBeNull();
  });
});
