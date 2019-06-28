const Discord = require('discord.js');
module.exports = {
	name: 'reload',
	description: 'Reloads The Given Command!',
	guildOnly: false,
  usage: ['reload <cmd_name>'],
	aliases: ['r'],
  example:['reload help'],
   module: 'Owner',
	async execute(client, message, args) {
    if(message.author.id !== '316943845596200960') return;
   
		const commandName = args[0];
		if(!client.commands.has(commandName)) {
			return message.reply('That command does not exist');
		}
		delete require.cache[require.resolve(`./${commandName}.js`)];
	client.commands.delete(commandName);
		const props = require(`./${commandName}.js`);
		client.commands.set(commandName, props);
		const reloadembed = new Discord.RichEmbed()
			.setColor('RANDOM')
			.addField('Command Reloaded  <:tick:446704972541984769>', `${message.client.user.username} has reloaded<:discord:446702657944682508> **${args[0]}** command.`);
		message.channel.send(reloadembed);
	},
};
