
import { useCallback } from 'react';
import { Lead, Priority } from '../types';

type LeadScoringInput = Omit<Lead, 'id' | 'score' | 'status' | 'priority' | 'contactHistory' | 'createdAt'>;

export const useLeadScoring = () => {
    const calculateScore = useCallback((leadData: LeadScoringInput): { score: number, priority: Priority } => {
        let score = 0;
        const totalMonthlyBill = leadData.avgEnergyBill + leadData.avgGasBill;

        // 1. Potential Savings (max 40 points)
        // Assume our plan offers an average of 15% savings.
        // We relate this to a benchmark potential saving of 50€ for max points.
        const potentialMonthlySaving = totalMonthlyBill * 0.15;
        const economyScore = (potentialMonthlySaving / 50) * 40;
        score += Math.min(economyScore, 40);

        // 2. Propensity to Change (max 30 points)
        if (leadData.yearsWithProvider > 2) {
            score += 20;
        } else if (leadData.yearsWithProvider > 1) {
            score += 10;
        }
        if (leadData.changeHistory > 0) {
            score += 10;
        }

        // 3. Ideal Customer Profile (max 20 points)
        if (totalMonthlyBill >= 50 && totalMonthlyBill <= 150) {
            score += 15;
        }
        if (leadData.contractedPower > 4.6) {
            score += 5;
        }

        // 4. Engagement (max 10 points)
        if (leadData.visitedCalculator) {
            score += 5;
        }
        if (leadData.timeOnPage > 120) {
            score += 5;
        }

        const finalScore = Math.round(Math.min(score, 100));

        let priority: Priority;
        if (finalScore >= 80) {
            priority = Priority.HIGH;
        } else if (finalScore >= 50) {
            priority = Priority.MEDIUM;
        } else {
            priority = Priority.LOW;
        }

        return { score: finalScore, priority };
    }, []);

    return { calculateScore };
};
   