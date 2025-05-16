export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const container = options.container?.value || document.getElementById(options.containerID)
    if (!container) return

    // Clear previous legend
    container.innerHTML = ''

    // Get chart data
    const { data } = chart
    if (!data || !data.datasets.length) return

    const dataset = data.datasets[0]
    const total = dataset.data.reduce((a, b) => a + b, 0)

    // Create legend items
    data.labels.forEach((label, i) => {
      const value = dataset.data[i]
      const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00'
      const color = dataset.backgroundColor[i]
      const formattedValue = value.toLocaleString('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      const legendItem = document.createElement('div')
      legendItem.style.display = 'flex'
      legendItem.style.alignItems = 'center'
      legendItem.style.marginBottom = '4px'
      legendItem.style.fontSize = '12px'

      const colorBox = document.createElement('div')
      colorBox.style.width = '12px'
      colorBox.style.height = '12px'
      colorBox.style.backgroundColor = color
      colorBox.style.marginRight = '8px'
      colorBox.style.borderRadius = '2px'

      const text = document.createElement('span')
      text.textContent = `${label}: $${formattedValue} (${percentage}%)`

      legendItem.appendChild(colorBox)
      legendItem.appendChild(text)
      container.appendChild(legendItem)
    })
  }
} 