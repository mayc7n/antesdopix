import { act, fireEvent, render } from '@testing-library/react-native';
import { Share } from 'react-native';

import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { useAnalysisStore } from '@/state/analysisStore';
import ResultScreen from '../result';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

describe('ResultScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await act(async () => {
      useAnalysisStore.getState().clearAnalysis();
    });
  });

  it('oferece compartilhamento do resumo sem incluir a mensagem original', async () => {
    const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });
    const originalMessage = 'Pague agora para resgatar seu prêmio.';

    useAnalysisStore
      .getState()
      .setAnalysis(analyzeInput(originalMessage, 'manual'));

    const screen = await render(<ResultScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Compartilhar resumo' }));

    expect(shareSpy).toHaveBeenCalledWith({
      message: expect.stringContaining('Antes do Pix — resumo da análise'),
    });
    expect(shareSpy.mock.calls[0]?.[0].message).not.toContain(originalMessage);
    expect(screen.queryByText(originalMessage)).toBeNull();
  });
});
