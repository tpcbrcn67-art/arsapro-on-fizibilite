export function formatCurrencyTL(value: number, compact: boolean = false): string {
  if (isNaN(value)) return '0 ₺';

  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Milyar ₺`;
    }
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Milyon ₺`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} Bin ₺`;
    }
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, maxDecimals: number = 0): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals > 0 ? 1 : 0,
  }).format(value);
}

export function formatArea(value: number, includeUnit: boolean = true): string {
  const formatted = formatNumber(value, 0);
  return includeUnit ? `${formatted} m²` : formatted;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '%0';
  return `%${value.toFixed(decimals).replace('.', ',')}`;
}

// Aliases for convenience
export const formatCurrency = formatCurrencyTL;
export const formatM2 = formatArea;

