/**
 * Indian Rupee currency and date formatters.
 * Formats numbers using the Indian numbering system (lakhs & crores)
 * matching Flutter AppFormatters.dart.
 */

const inrFormatNoDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const inrFormatWithDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export class AppFormatters {
  /**
   * Formats currency with Indian numbering (e.g. ₹ 1,50,000 or ₹ 71,365.83).
   */
  static formatCurrency(amount: number, showDecimals: boolean = false): string {
    if (isNaN(amount) || !isFinite(amount)) return '₹0';
    if (showDecimals) {
      return inrFormatWithDecimals.format(amount);
    }
    return inrFormatNoDecimals.format(Math.round(amount));
  }

  /**
   * Formats date as 'dd MMM yyyy' (e.g. 15 Oct 2028).
   */
  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Formats date and time as 'dd MMM yyyy, hh:mm a' (e.g. 01 Nov 2026, 07:45 PM).
   */
  static formatDateTime(date: Date): string {
    const datePart = this.formatDate(date);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, '0');
    return `${datePart}, ${hoursStr}:${minutes} ${ampm}`;
  }

  /**
   * Formats month and year as 'MMM yyyy' (e.g. Nov 2026).
   */
  static formatMonthYear(date: Date): string {
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  /**
   * Parses Indian numeric strings (handles commas, spaces, currency symbols).
   */
  static parseCleanNumber(input: string): number {
    const cleaned = input.replace(/[₹,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
}
