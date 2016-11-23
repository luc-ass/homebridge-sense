var request = require("request");
var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-sense", "Sense", Sense);


  function Sense(log, config) {
    // configuration
    this.username = config['username'];
    this.password = config['password'];
    this.client_id = config['client_id'] || "8d3c1664-05ae-47e4-bcdb-477489590aa4";
    this.client_secret = config['client_secret'] || "4f771f6f-5c10-4104-bbc6-3333f5b11bf9";

    this.log = log;

    this.token_url = "https://api.sense.is/v1/oauth2/token";
    this.conditions_url = "https://api.sense.is/v1/room/current?temp_unit=c";

  }

  // Custom Characteristics and service...

  // Fill Characteristics

  // Export Characteristics
}
