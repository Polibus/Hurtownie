import * as _ from "lodash";
const axios = require('axios');

async function query() {
    let result = await axios({method:'get', url:"http://api.openweathermap.org/data/2.5/weather?q=Tarnow,pl&appid=0f4f91b9970fd65ca1c961606a144a25"})
    result = result.data
    console.log(result)
    if (result) {
        return result;
    }

 }

 async function get(id) {
    return ParamModel.findOne({'_id': id}).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    });
 }

 async function getLast() {
    return ParamModel.findOne().sort({'_id':-1}).limit(1).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    })
 }
 
 

export default {
    query: query,
    get: get,
    getLast,
};
