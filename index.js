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
	this.interval = config['interval'] || 30
    this.client_id = config['client_id'] || "8d3c1664-05ae-47e4-bcdb-477489590aa4";
    this.client_secret = config['client_secret'] || "4f771f6f-5c10-4104-bbc6-3333f5b11bf9";

    // request token on initialization for later requests.
    // token lives for about a year
    // I expect the server to be restarted more often
    sense.login(this.username, this.password, this.log, function(token){
      permanent_token = token;
    });
	
	this.getSensorData()
  }

  SenseAccessory.prototype = {

  	getSensorData: function() {
  	var that = this
  	  sense.sensor_data(this.username, this.password, permanent_token, function(temperature, humidity, sound, light, air_quality){
  		  	// that.log("Current Sense Conditions: Temperature: " + temperature + "C, Humidity: " + humidity + ", Light Level: " + light);
  			that.temperatureService.setCharacteristic(Characteristic.CurrentTemperature, temperature);
  			that.humidityService.setCharacteristic(Characteristic.CurrentRelativeHumidity, humidity);
  			that.ambientLightService.setCharacteristic(Characteristic.CurrentAmbientLightLevel, light);
  			that.airQualityService.setCharacteristic(Characteristic.AirQuality, air_quality);
  	  });
  	 // Updates once every 30
  	setTimeout(this.getSensorData.bind(this), this.interval * 1000);
  	},

    getServices: function() {

      var informationService = new Service.AccessoryInformation();
      informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, "Hello.is")
        .setCharacteristic(Characteristic.Model, "Sense")
        .setCharacteristic(Characteristic.SerialNumber, "ABC1234");

      this.temperatureService = new Service.TemperatureSensor("Current Temperature");

      this.humidityService = new Service.HumiditySensor("Current Humidity");

      this.ambientLightService = new Service.LightSensor("Current Light Level");

      this.airQualityService = new Service.AirQualitySensor("Current Air Quality");

      return [this.temperatureService, this.humidityService, this.ambientLightService, this.airQualityService];
    }
  }
}
