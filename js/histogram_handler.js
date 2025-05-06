import "../lib/chart.js"

/** 
 * Initializes the histogram chart.
 * If one already exists, it will be returned.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the histogram on.
 * @returns {Chart} - The Chart.js instance for the histogram.
 */
function initOrGetHistogram(canvas) {
  let chart = getChart(canvas);
  if (chart) {
    return chart;
  }

  // If no chart exists, create a new one
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [...Array(256).keys()],
      datasets: [],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          }
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

/**
 * Retrieves the histogram chart instance from the canvas context.
 * 
 * @param {HTMLCanvasElement} ctx - The 2D rendering context for the canvas element.
 * @returns {Chart | undefined} - The Chart.js instance for the histogram, or undefined if not found.
 */
function getChart(ctx) {
  return Chart.getChart(ctx);
}

/**
 * Updates the histogram chart with new data.
 * This clears all the existing datasets.
 * 
 * @param {Chart} chart - The Chart.js instance for the histogram.
 * @param {Array<{data: Array<number>, backgroundColor: string | null}>} data - The data to update the histogram with.
 * @returns {void}
 */
function updateHistogram(chart, data) {
  chart.data.datasets = data.map((dataset) => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: dataset.backgroundColor || null,
    borderWidth: 0,
  }));

  chart.update();
}

export {
  initOrGetHistogram,
  updateHistogram
};