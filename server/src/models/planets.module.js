const parse = require("csv-parse");
const fs = require("fs");
const path = require("path");

const habitablePlanets = [];

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse.parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("end", () => {
        console.log(`${habitablePlanets.length} Habitable Planets Found!`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    1.11 > planet["koi_insol"] &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_prad"] < 1.6
  );
}

module.exports = { loadPlanetsData, planets: habitablePlanets };
