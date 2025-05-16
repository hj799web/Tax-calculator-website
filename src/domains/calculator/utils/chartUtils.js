export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export const generateColors = (count) => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC24A', '#FF5722', '#2196F3', '#9C27B0',
    '#E91E63', '#00BCD4', '#FFC107', '#795548', '#607D8B'
  ]
  
  // If we need more colors than we have, generate them
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360 // Golden angle approximation
      colors.push(`hsl(${hue}, 70%, 60%)`)
    }
  }
  
  return colors.slice(0, count)
} 