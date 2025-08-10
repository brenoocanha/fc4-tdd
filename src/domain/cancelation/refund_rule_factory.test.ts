import { RefundRuleFactory } from './refund_rule_factory';
import { FullRefund } from './full_refund';
import { PartialRefund } from './partial_refund';
import { NoRefund } from './no_refund';

describe('RefundRuleFactory', () => {
  const MOCK_TODAY = '2025-08-10T12:00:00.000Z';

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCK_TODAY));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência', () => {
    const daysUntilCheckIn = 8;

    const rule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(rule).toBeInstanceOf(FullRefund);
  });

  it('deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência', () => {
    const daysUntilCheckIn = 7;

    const rule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(rule).toBeInstanceOf(PartialRefund);
  });

  it('deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência', () => {
    const daysUntilCheckIn = 0;

    const rule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(rule).toBeInstanceOf(NoRefund);
  });

  it('deve retornar PartialRefund quando a reserva for cancelada com exatamente 7 dias de antecedência', () => {
    const daysUntilCheckIn = 7;

    const rule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(rule).toBeInstanceOf(PartialRefund);
  });
});
