import { getNextSteps } from '../nextSteps';

describe('getNextSteps', () => {
  it('orienta o que fazer quando há sinais compatíveis com golpe', () => {
    const steps = getNextSteps('possivelGolpe');

    expect(steps[0]?.description).toContain('Não faça o pagamento');
  });

  it('orienta uma pausa quando há sinais de atenção', () => {
    const steps = getNextSteps('atencao');

    expect(steps[0]?.description).toContain('Pare');
  });

  it('orienta a conferência bancária mesmo com poucos sinais', () => {
    const steps = getNextSteps('baixoRisco');
    const descriptions = steps.map((step) => step.description).join(' ');

    expect(descriptions).toContain('Confirme o beneficiário');
    expect(descriptions).not.toMatch(/seguro|garantido/i);
  });
});
