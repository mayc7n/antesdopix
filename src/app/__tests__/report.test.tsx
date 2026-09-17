import { render } from '@testing-library/react-native';

import ReportScreen from '../report';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

describe('ReportScreen', () => {
  it('orienta a pessoa sem fingir que registrou uma denúncia', async () => {
    const screen = await render(<ReportScreen />);

    expect(screen.getByText(/O app não registra a denúncia por você/)).toBeTruthy();
    expect(screen.getByText('Não faça o pagamento.')).toBeTruthy();
    expect(screen.getByText('Entre imediatamente em contato com seu banco.')).toBeTruthy();
    expect(screen.getByText('Se houve transferência, solicite contestação e o MED.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abrir orientações do Banco Central' })).toBeTruthy();
  });
});
