import { fireEvent, render } from '@testing-library/react-native';

import { ConfirmationChecklist } from '../ConfirmationChecklist';

describe('ConfirmationChecklist', () => {
  it('permite marcar os três pontos de conferência', async () => {
    const screen = await render(<ConfirmationChecklist />);

    expect(screen.getByText('Checklist antes de pagar')).toBeTruthy();
    const beneficiaryCheck = screen.getByRole('checkbox', { name: 'Conferi o beneficiário no banco' });
    const valueCheck = screen.getByRole('checkbox', { name: 'O valor confere com o combinado' });
    const secretCheck = screen.getByRole('checkbox', { name: 'Não foi pedido senha ou código' });

    await fireEvent.press(beneficiaryCheck);
    await fireEvent.press(valueCheck);
    await fireEvent.press(secretCheck);

    expect(screen.getByText('Conferência concluída. Ainda confirme no banco antes de pagar.')).toBeTruthy();
  });
});
