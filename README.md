# homebridge-sense
Homebridge plugin for Hello Sense sleep tracking device

# Installation
As of now this plugin can be installed from npm: 
    
    npm install -g homebridge-sense

# Configuration
Example:

    {
        "accessory": "Sense",
        "name": "Sense",
        "username": "something@something.com",
        "password": "password"
    }

# Roadmap
* [x] write NodeJS-Plugin for Hello Sense for later use in Plugin
* [ ] implement characteristics: 
    * [x] Temperature 
    * [x] Humidity
    * [ ] Sound (background noise) - no idea which characteristic to use here
    * [x] Light (ambient light level)
    * [x] Particulate density / air quality
    * [ ] Battery status for Sleep Pills
* [ ] change plugin so that all data will be updated with a single request to speed up and save resources
* [ ] implement periodic update to enable automation without opening any app.
* [ ] Add characteristics for alarms (not sure which and how)...
