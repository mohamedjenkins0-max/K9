export interface GradeCalculation {
  total: number;
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  gpaPoint: number;
  description: string;
}

export function calculateGrade(ca: number, exam: number): GradeCalculation {
  const safeCA = Math.max(0, Math.min(30, Number(ca) || 0));
  const safeExam = Math.max(0, Math.min(70, Number(exam) || 0));
  const total = Math.round((safeCA + safeExam) * 10) / 10;

  if (total >= 80) {
    return { total, letter: 'A', gpaPoint: 4.0, description: 'Excellent' };
  } else if (total >= 70) {
    return { total, letter: 'B', gpaPoint: 3.0, description: 'Very Good' };
  } else if (total >= 60) {
    return { total, letter: 'C', gpaPoint: 2.5, description: 'Credit (Good)' };
  } else if (total >= 50) {
    return { total, letter: 'D', gpaPoint: 2.0, description: 'Pass' };
  } else if (total >= 40) {
    return { total, letter: 'E', gpaPoint: 1.0, description: 'Weak Pass' };
  } else {
    return { total, letter: 'F', gpaPoint: 0.0, description: 'Fail' };
  }
}

export function formatSLECurrency(amount: number): string {
  return `SLE ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
