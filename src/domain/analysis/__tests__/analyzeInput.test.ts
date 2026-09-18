import { analyzeInput } from '../analyzeInput';

describe('analyzeInput', () => {
  it('classifica uma mensagem sem sinais como baixo risco sem garantir segurança', () => {
    const analysis = analyzeInput(
      'Oi, podemos conversar sobre a reunião de amanhã?',
      'manual',
    );

    expect(analysis.result.level).toBe('baixoRisco');
    expect(analysis.result.message).toBe(
      'Encontramos poucos sinais de risco, mas isso não garante que o pagamento seja seguro. Confirme o beneficiário no aplicativo do seu banco.',
    );
    expect(analysis.result.limitations).toContain(
      'A análise não garante que o pagamento seja seguro.',
    );
  });

  it('identifica urgência e prêmio em linguagem cotidiana', () => {
    const analysis = analyzeInput(
      'Pague agora para resgatar seu prêmio. É a última chance!',
      'colar',
    );

    expect(analysis.result.signals.map((signal) => signal.code)).toEqual(
      expect.arrayContaining(['urgencia', 'premio']),
    );
    expect(analysis.result.level).toBe('atencao');
  });

  it('reconhece sinais quando a pontuação separa as palavras', () => {
    const analysis = analyzeInput('Pague, agora!', 'manual');

    expect(analysis.result.signals.map((signal) => signal.code)).toContain('urgencia');
  });

  it('identifica pedidos de senha e códigos e classifica como possível golpe', () => {
    const analysis = analyzeInput(
      'Envie sua senha e o código SMS agora para liberar sua conta.',
      'compartilhar',
    );

    expect(analysis.result.signals.map((signal) => signal.code)).toContain(
      'pedidoDeSegredo',
    );
    expect(analysis.result.level).toBe('possivelGolpe');
    expect(JSON.stringify(analysis)).not.toContain('código SMS agora');
  });

  it('identifica palavras de risco separadas por caracteres invisíveis', () => {
    const analysis = analyzeInput('Envie sua s\u200Benha agora.', 'manual');

    expect(analysis.result.signals.map((signal) => signal.code)).toContain(
      'pedidoDeSegredo',
    );
  });

  it('identifica link inseguro e encurtador sem acessar a internet', () => {
    const analysis = analyzeInput('http://bit.ly/pague-agora', 'manual');

    expect(analysis.input.type).toBe('link');
    expect(analysis.input.url).toMatchObject({
      domain: 'bit.ly',
      scheme: 'http',
      isShortener: true,
    });
    expect(analysis.result.signals.map((signal) => signal.code)).toEqual(
      expect.arrayContaining(['linkInseguro', 'dominioEstranho']),
    );
  });

  it('reconhece encurtador mesmo com o prefixo www', () => {
    const analysis = analyzeInput('https://www.bit.ly/pague-agora', 'manual');

    expect(analysis.input.url).toMatchObject({
      domain: 'www.bit.ly',
      isShortener: true,
    });
  });

  it('identifica uma chave Pix incompatível e mascara o trecho exibido', () => {
    const analysis = analyzeInput('Chave Pix: 1234', 'manual');

    expect(analysis.input.pix).toMatchObject({
      keyType: 'desconhecida',
      maskedKey: '***1234',
    });
    expect(analysis.result.signals.map((signal) => signal.code)).toContain(
      'chaveInvalida',
    );
    expect(JSON.stringify(analysis)).not.toContain('Chave Pix: 1234');
  });

  it('reconhece telefone com pontos e hífen', () => {
    const analysis = analyzeInput('11.99999-9999', 'manual');

    expect(analysis.input.type).toBe('telefone');
    expect(analysis.input.phone).toBe('11.99999-9999');
  });

  it('remove pontuação final antes de mascarar uma chave Pix', () => {
    const analysis = analyzeInput('Chave Pix: 1234!', 'manual');

    expect(analysis.input.pix?.maskedKey).toBe('***1234');
  });

  it('identifica pressão emocional e pedido para esconder a operação', () => {
    const analysis = analyzeInput(
      'Seu filho está em perigo. Não conte para ninguém e transfira agora.',
      'colar',
    );

    expect(analysis.result.signals.map((signal) => signal.code)).toContain(
      'pressaoEmocional',
    );
    expect(analysis.result.level).toBe('atencao');
  });

  it('combina sinais fortes sem expor o texto original', () => {
    const analysis = analyzeInput(
      'Última chance: envie seu token e senha agora. Não conte para ninguém.',
      'manual',
    );

    expect(analysis.result.level).toBe('possivelGolpe');
    expect(analysis.input.textTemporario).toBe(true);
    expect(analysis).not.toHaveProperty('input.rawText');
    expect(JSON.stringify(analysis)).not.toContain('Última chance');
  });

  it('preserva QR Code como origem própria sem iniciar pagamento', () => {
    const analysis = analyzeInput('00020126580014BR.GOV.BCB.PIX', 'qrCode');

    expect(analysis.input.origin).toBe('qrCode');
    expect(analysis.input.type).toBe('qrCode');
  });
});
