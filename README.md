# homebridge-sense
Homebridge plugin for Hello Sense sleep tracking device

# Installation
As of now this plugin can be installed from npm: `npm install -g homebridge-sense`

# Configuration
Example:

    {
        "accessory": "Sense",
        "name": "Sense",
        "username": "something@something.com",
        "password": "password"
    }

# Roadmap
- ~~write NodeJS-Plugin for Hello Sense for later use in Plugin~~
- implement ~~Temperature~~, ~~Humidity~~, Sound (noise), ~~Light (ambient light)~~, ~~Particulate (air quality)~~
- change plugin so that all data will be updated with a single request to speed up and save resources
- implement periodic update to enable automation without opening any app.
