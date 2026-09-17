import { prepareSharedAnalysis } from '../prepareSharedAnalysis';

describe('prepareSharedAnalysis', () => {
  it('converte texto recebido pelo compartilhamento em análise temporária', () => {
    const analysis = prepareSharedAnalysis('Pague agora para resgatar seu prêmio.');

    expect(analysis?.input.origin).toBe('compartilhar');
    expect(analysis?.result.level).toBe('atencao');
  });

  it('ignora conteúdo compartilhado vazio', () => {
    expect(prepareSharedAnalysis('   ')).toBeNull();
  });
});
