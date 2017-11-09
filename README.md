# eManual_server

## Requirements
* MongoDB
* NodeJS (min. 8.x.x)
* OS: Linux, Windows, Mac


## Start Server
(required MongoDB is startet)

Install all packages
```
npm install
```


Start the server
```
npm start
```

or if you have trouble with the port you can set the port on startup
e.g. start the Server on Port 80 - BUT it is recommend to use the standard Port 3000 and the development-mode (NODE_ENV=development or without NODE_ENV)

```
# WINDOWS
set PORT=80 && npm start

# Mac, UNIX
export PORT=80 && npm start
```

Available Startup-Parameters:
* NODE_ENV (development, production, test)
* ADRESSE
* PORT
* DATABASE_URL
* SECRET

## Testing
* start Test Manual
```
npm test
```
* autmotic Tets on each push in git with the plugin pre-push:
https://www.npmjs.com/package/pre-push

## Install

### MongoDB

#### Windwos

* Download and Install the latest Version of MongoDB for Windwos (https://www.mongodb.com/download-center#community)
* Create directories for your database and log files e.g.
```
mkdir D:\MongoDB\Server\3.4\data\db
mkdir D:\MongoDB\Server\3.4\data\log
```
* Create a configuration file  *mongod.cfg* at *D:\MongoDB\Server\3.4\bin*
```
systemLog:
    destination: file
    path: D:\MongoDB\Server\3.4\data\log\mongod.log
storage:
    dbPath: D:\MongoDB\Server\3.4\data\db
```
* Install the MongoDB as service (**You must start the terminal as admin**), the service will start when the system is started
```
"D:\MongoDB\Server\3.4\bin\mongod.exe" --config "D:\MongoDB\Server\3.4\bin\mongod.cfg" --install
```
* Start/Stop service manuel
```
# Start
net start MongoDB

# Stop
net stop MongoDB
```
* more informations: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition

#### Mac
* use *Homebrew* to install MongoDB (https://brew.sh/)
* update Homebrews package database
```
brew update
```
* install MongoDB
```
brew install mongodb
```
* start services
```
brew services start mongodb
```
* Optional: you can change the settings under
```
nano /usr/local/etc.mongod.cfg
```
* more informations: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

## NodeJS
Download and install the latest stable version https://nodejs.org/en/download/