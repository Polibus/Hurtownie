import cors from 'cors';
import express from 'express';
const weatherSchema = require("./schema/weatherSchema")
const mongoose = require('mongoose')
const mongo = require('./service/mongo')
const axios = require('axios');
const CronJob = require('cron').CronJob;
const { port } = require('./config')
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

const app = express();

app.use(cors());

process.on('SIGINT', () => {
  mongoose.connection.close(function () {
    console.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


http.listen(port, async function () {
  console.info(`Server is running at ${port}`)
  await mongo().then((mongoose) => {
    console.log('connected to database')
  })
});

const mainTask = async (cityName) => {
  await axios({ method: 'get', url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName},pl&appid=0f4f91b9970fd65ca1c961606a144a25&units=metric` })
    .then((result) => {
      result = result.data
      console.log(mongoose.connection.readyState)
      return weatherSchema.insertOne({
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
    })
}


const job = new CronJob(
  '0 * * * *',
  async function () {
    mainTask("Tarnow").then(mainTask("Warsaw").then(mainTask("Krakow")))
  },
  null,
  true,
  'Europe/Warsaw'
);

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} user just connected!`)

  socket.on('getData', async (city, dateFirst, dateSecond) => {
    console.log("sendindg data")
    try {
        let data = await weatherSchema.find({"city":city, "date":{ $gt:dateFirst, $lt:dateSecond}})
        callback({
          data: data
        })
    } catch (e) {
        console.log('error sending data: ', e)
    }
})
  
  socket.on('disconnect', () => {
    console.log('A user disconnected')
    socket.disconnect()
});
})

