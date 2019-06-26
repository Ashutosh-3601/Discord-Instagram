const Discord = require('discord.js');
const client = new Discord.Client({
  disableEveryone: true,
  disabledEvents: ['TYPING_START']
});

const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {
  useNewUrlParser: true
});

/*-------EXTENSIONS---------*/
client.commands = new Discord.Collection()

/* ------------------------------------------------------------------------------*/
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}

/*-----------------------Event----------------------------------*/
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
    console.log(`Loaded Event: [ ${file} ]`)
  });
});

/* ----------------------------------------UNHANDLED_REJECTION HANDELER{-------------------------------*/
process.on('unhandledRejection', error => {
	console.log('Unhandled promise rejection: => \n', error);
});
process.on('uncaughtException', function(err) {
	console.log(err);
});

client.login(process.env.TOKEN);
