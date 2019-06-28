const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	guildOnly: true,
	usage: ['help <cmd>', 'help'],
	aliases: ['halp', 'h', 'commands'],
	module: 'Utility',
	example:['help', 'help reason'],
	async execute(client, message, args) {
    if(!args[0]) {
			const helpe = new Discord.RichEmbed()
				.setTitle('Here\'s a list of all my **Commands**:')
				.setAuthor(message.client.user.username, 'https://cdn.discordapp.com/emojis/456503666288099328.png?v=1')
				.setColor('#7289da')
				.addField('<:bottag:449231978961698836> ❱ Prefix', '`+`', true)
				.addField(' ❱ Bot Owner', `**\`${client.commands.filter(x => x.module == 'Owner').map(x => x.name).join('` • `')}\`**`)
				.addField(' ❱ Basics', `**\`${client.commands.filter(x => x.module == 'Basic').map(x => x.name).join('` • `')}\`**`)
				.setFooter(`Replying To ${message.author.tag}| Reply with +help <command name> to get more information`, message.author.avatarURL);
			message.channel.send(helpe);
			return;
		}
		const name = args[0].toLowerCase();
		const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send('That\'s not a valid command!');
		}
		const hele = new Discord.RichEmbed()
			.setTitle(`Help For Command: **${command.name}**`)
			.setColor('#7289da')
			.addField('Name', `${name}`)
			.addField('Description', `\`\`\`${command.description}\`\`\``)
			.addField('Aliases', `${command.aliases.length > 0 ? `\`${command.aliases.join('`, `')}\`` : '`No Aliases!`'}`)
			.addField('Is Guild Only?', command.guildOnly)
			.addField('Syntax Usage', `\`${command.usage.join('`, `')}\``)
			.addField('Example Usage', `\`${command.example.join('`, `')}\``)
			.setFooter(`Replying To ${message.author.tag}`, message.author.avatarURL);
		message.channel.send(hele);
	},
};
  
