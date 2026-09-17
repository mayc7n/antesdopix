import { act, render } from '@testing-library/react-native';

import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { useAnalysisStore } from '@/state/analysisStore';
import DetailsScreen from '../details';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

describe('DetailsScreen', () => {
  afterEach(async () => {
    await act(async () => {
      useAnalysisStore.getState().clearAnalysis();
    });
  });

  it('explica em detalhes por que cada sinal merece atenção', async () => {
    useAnalysisStore
      .getState()
      .setAnalysis(analyzeInput('Pague agora para resgatar seu prêmio.', 'manual'));

    const screen = await render(<DetailsScreen />);

    expect(screen.getByText('Detalhes dos sinais')).toBeTruthy();
    expect(screen.getByText('A mensagem cria pressão para pagar imediatamente')).toBeTruthy();
    expect(screen.getByText('O que fazer: pare e confirme a cobrança por um canal conhecido.')).toBeTruthy();
  });
});
