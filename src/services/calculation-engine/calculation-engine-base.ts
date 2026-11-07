import { SchemeId } from '@/data/models/scheme-type';

/**
 * Pure data structure representing the generic result of a financial calculation.
 * Equivalent to CalculationResult in Flutter calculation_engine_base.dart.
 */
export interface GenericCalculationResult {
  schemeId: SchemeId;
  principalAmount: number;
  totalDeposit: number;
  interestEarned: number;
  maturityAmount: number;
  tenureInYears: number;
  applicableInterestRate: number;
  monthlyPayout?: number;
  quarterlyPayout?: number;
  annualPayout?: number;
}

export class CalculationValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationValidationException';
  }
}
