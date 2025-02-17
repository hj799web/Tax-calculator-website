// A helper function to get or create the legend list.
// It supports both an element ID (string) and a Vue ref.
const getOrCreateLegendList = (chart, container) => {
  let legendContainer;

  // If container is a string, use document.getElementById
  if (typeof container === 'string') {
    legendContainer = document.getElementById(container);
  } 
  // If container is an object with a .value (Vue ref), use that.
  else if (container && container.value) {
    legendContainer = container.value;
  } 
  // Otherwise, assume it's already a DOM element.
  else {
    legendContainer = container;
  }

  if (!legendContainer) {
    return;
  }

  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'column';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;
    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    // Use the container from options (either container or containerID)
    const container = options.container || options.containerID;
    const ul = getOrCreateLegendList(chart, container);

    if (!ul) {
      console.warn('Legend container not found in htmlLegendPlugin.');
      return;
    }

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Retrieve the dataset to calculate percentages.
    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((a, b) => a + b, 0);

    // Generate new legend items using Chart.js's built-in generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';
      li.style.marginBottom = '4px';

      li.onclick = () => {
        const { type } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Create the color box for the legend
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = 0;
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      // Calculate percentage for this legend item
      const value = dataset.data[item.index];
      const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00';
      // Append percentage to the item text (keeping the original text if desired)
      const legendText = `${item.text} (${percentage}%)`;

      // Create the text element with a small font size (10px) and darker color
      const textContainer = document.createElement('p');
      textContainer.style.color = '#000'; // Dark font color (black)
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.fontSize = '10px'; // Legend text size set to 10px
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(legendText);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};
