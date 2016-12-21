var sense = require('./lib/sense');
var Characteristic, Service;

var permanent_token;

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-sense", "Sense", SenseAccessory);

  function SenseAccessory(log, config) {
    this.log = log;

    this.name = config['name'];
    this.username = config['username'];
    this.password = config['password'];
    this.client_id = config['client_id'] || "8d3c1664-05ae-47e4-bcdb-477489590aa4";
    this.client_secret = config['client_secret'] || "4f771f6f-5c10-4104-bbc6-3333f5b11bf9";

    this.token_url = "https://api.sense.is/v1/oauth2/token";
    this.conditions_url = "https://api.sense.is/v1/room/current?temp_unit=c";

    // request token on initialization for later requests.
    // token lives for about a year
    // I expect the server to be restarted more often
    sense.login(this.username, this.password, this.log, function(token){
      permanent_token = token;
    });
  }

  SenseAccessory.prototype = {

    getTemperature: function(callback) {
      this.log("Requesting temperature!");
      sense.temperature(this.username, this.password, permanent_token, function(temperature){
        callback(null, temperature);
      });
    },

    getHumidity: function(callback) {
      this.log("Requesting humidity!");
      sense.humidity(this.username, this.password, permanent_token, function(humidity){
        callback(null, humidity);
      });
    },

    getLightLevel: function(callback) {
      this.log("Requesting ambient light level!");
      sense.light(this.username, this.password, permanent_token, function(light){
        callback(null, light);
      });
    },

    getParticulateDensity: function(callback) {
      this.log("Requesting ambient light level!");
      sense.particulates(this.username, this.password, permanent_token, function(light){
        callback(null, light);
      });
    },

    getParticulateSize: function(callback) {
      // Return 0 for particulate size 2.5 microns
      this.log("Requesting particulate size");
      callback(null, 0);
    },

    getAirQuality: function(callback) {
      this.log("Requesting Air Quality!");
      sense.airQuality(this.username, this.password, permanent_token, function(airQuality){
        callback(null, airQuality);
      });
    },

    getServices: function() {

      var informationService = new Service.AccessoryInformation();
      informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, "Hello.is")
        .setCharacteristic(Characteristic.Model, "Sense")
        .setCharacteristic(Characteristic.SerialNumber, "ABC1234");

      var temperatureService = new Service.TemperatureSensor(this.name);
      temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this));

      var humidityService = new Service.HumiditySensor(this.name);
      humidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', this.getHumidity.bind(this));

      var ambientLightSerivce = new Service.LightSensor(this.name);
      ambientLightSerivce
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .on('get', this.getLightLevel.bind(this));

      var airQualityService = new Service.AirQualitySensor(this.name);
      airQualityService
        .getCharacteristic(Characteristic.AirParticulateDensity)
        .on('get', this.getParticulateDensity.bind(this));
      // Is not known yet. Not very good documented by Hello Inc.
      // airQualityService
      //  .getCharacteristic(Characteristic.AirParticulateSize)
      //  .on('get', this.getParticulateSize.bind(this));
      airQualityService
        .getCharacteristic(Characteristic.AirQuality)
        .on('get', this.getAirQuality.bind(this));

      return [temperatureService, humidityService, ambientLightSerivce, airQualityService];
    }
  }
}
