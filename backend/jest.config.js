// https://github.com/maxmind/MaxMind-DB/blob/master/source-data/GeoIP2-City-Test.json
process.env.GEOIP_DATABASE_PATH = `${__dirname}/src/test-utils/GeoIP2-City-Test.mmdb`;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 90,
      lines: 90,
    },
  },
};
