const mongoose = require('mongoose')

const weatherSchema = mongoose.Schema({
    date:Number,
    timezone:Number,
    city:String,
    weather:String,
    temp:Number,
    feelsLike:Number,
    pressure:Number,
    humidity:Number,
    visibility:Number,
    windSpeed:Number,
    windDeg:Number,
})

module.exports = mongoose.model('weathers', weatherSchema)