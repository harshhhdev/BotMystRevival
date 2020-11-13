const weather = require('weather-js');
const Discord = require('discord.js');
const {
    weatherDegreeType, SuccessColor, FailureColor
} = require('../config.json');

module.exports = {
    name: "weather",
    description: "Checks a weather forecast. If you are having problems make sure you arent checking the weather for an entire country.",
    aliases: ['forecast'],
    usage: ">weather Brisbane [Returns Weather Forecast] ",

    execute: async function(client, message, args) {

        //Using weather-js's handy .find function to get a simple result with all the info we need.
        weather.find({
            search: args.join(" "),
            degreeType: weatherDegreeType
        }, function(error, result) {

            if (!args[0]) { //if there are no arguments provided, send an error message.
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle('Please Specify a location!!')
                    .setDescription("e.g: >weather Brisbane [Returns Weather Forecast]")
                    .setColor(FailureColor)
                
                message.channel.send(errorEmbed);
                return message.react('👎');
            }

            if (result === undefined || result.length === 0) { //if the result is not found, then send an error embed.
                
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle('Couldnt find the location you provided!')
                    .setDescription('Check your spelling in case of an error, or make sure you are providing the name of a valid location / area, and not a country!')
                    .setColor(FailureColor)
                   
                 message.channel.send(errorEmbed);
                 return message.react('👎');
              
            }

            var current = result[0].current;
            var location = result[0].location;

            const weatherinfo = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather forecast for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(SuccessColor)
                //Weather Information Content.
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', 'Fahrenheit', true)
                .addField('Temperature', `${current.temperature}°`, true)
                .addField('Wind', current.winddisplay, true)
                .addField('Feels like', `${current.feelslike}°`, true)
                .addField('Humidity', `${current.humidity}%`, true)

            //Send the embed.
            message.channel.send(weatherinfo)
        })
    }
}