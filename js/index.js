const ctx = document.querySelector(".js-chart").getContext("2d");
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
  .then(parseData)
  .then(getLabelsAndData)
  .then(({ years, temps, east, west }) => drawChart(years, temps, east, west));

function fetchData() {
  return fetch("./zones.csv").then((response) => response.text());
}

function parseData(data) {
  return Papa.parse(data, { header: true }).data;
}

function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.temps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.east.push(
        (Number(entry["N.Hemi"]) + GLOBAL_MEAN_TEMPERATURE).toFixed(1)
      );
      acc.west.push(Number(entry["S.Hemi"]) + GLOBAL_MEAN_TEMPERATURE);
      return acc;
    },
    { years: [], temps: [], east: [], west: [] }
  );
}

function drawChart(labels, data, east, west) {
  console.log(east);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Global temps",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "East temps",
          data: east,
          backgroundColor: "rgba(0,0,0, 0.2)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "West temps",
          data: west,
          backgroundColor: "rgba(255,0,0, 0.2)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            callback(value) {
              return value + "°";
            },
          },
          // suggestedMin: 9,
          // suggestedMax: 15,
        },
      },
    },
  });
}
