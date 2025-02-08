export const formatCurrency = (value) => {
  const number = Number(value);
  if (isNaN(number)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export const generateColors = (count) => {
  const predefinedColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#E7E9ED',
    '#76A346',
    '#F4C430',
    '#D2691E',
  ];
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(predefinedColors[i % predefinedColors.length]);
  }
  return colors;
}

export const formatBudget = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '$0';
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(0)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)}M`;
  }
  return formatCurrency(value);
}