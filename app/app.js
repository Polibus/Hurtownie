import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import routes from './REST/routes';
const weatherSchema = require("./schema/weatherSchema")
const mongoose = require('mongoose')
const mongo = require('./service/mongo')
const axios = require('axios');
const CronJob = require('cron').CronJob;
const { port } = require('./config')

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2048kb' }));

app.use(express.static('public'));

app.use(cors());

process.on('SIGINT', () => {
  mongoose.connection.close(function () {
    console.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


routes(app);

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function () {
  console.info(`Server is running at ${port}`)
});

const mainTask = async (cityName) => {
  await axios({ method: 'get', url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName},pl&appid=0f4f91b9970fd65ca1c961606a144a25&units=metric` })
    .then((result) => {
      result = result.data
      console.log(mongoose.connection.readyState)
      let query = new weatherSchema({
        date: result.dt,
        timezone: result.timezone,
        city: result.name,
        weather: result.weather.main,
        temp: result.main.temp,
        feelsLike: result.main.feels_like,
        pressure: result.main.pressure,
        humidity: result.main.humidity,
        visibility: result.visibility,
        windSpeed: result.wind.speed,
        windDeg: result.wind.deg,
      })
      return query.save()
    })
}


const job = new CronJob(
  '0 * * * *',
  async function () {
    await mongo().then((mongoose) => {
      console.log('connected to database')
      mainTask("Tarnow").then(mainTask("Warsaw").then(mainTask("Krakow").then( () => { mongoose.connection.close() })))
    })
  },
  null,
  true,
  'Europe/Warsaw'
);