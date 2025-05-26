const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
})


export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

const numberFormatter = new Intl.NumberFormat('en-US')

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}