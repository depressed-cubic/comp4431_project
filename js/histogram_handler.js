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
          stacked: true,
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
 * @param {Array<{data: Array<number>, backgroundColor: string | null, borderColor: string| null, label: string, type: "bar" | "line"}>} data - The data to update the histogram with.
 * @returns {void}
 */
function updateHistogram(chart, data) {
  chart.data.datasets = data.map((dataset) => ({
    type: dataset.type,
    label: dataset.label,
    data: dataset.data,
    borderColor: dataset.borderColor,
    backgroundColor: dataset.backgroundColor || null,
    borderWidth: dataset.type === "line" ? 2 : 0,
    barPercentage: 1.0,
    categoryPercentage: 1.0,
    pointRadius: 0,
    pointHoverRadius: 3,
  }));

  chart.update();
}

export {
  initOrGetHistogram,
  updateHistogram
};