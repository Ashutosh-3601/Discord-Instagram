const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js')
module.exports = {
	name: 'intro',
	description: 'Set Your Introduction Which Is ViewAble From Profile Command.',
	guildOnly: true,
	usage: ['+intro <intro>', '+intro', '+intro reset'],
	aliases: ['setIntro', 'introduction', 'about'],
	module: 'Basic',
	example:['+intro #Hackweek On Peak', '+intro', '+intro reset'],
	async execute(client, message, args) {
    const user = await userSchema.findById(message.author.id);
    if(!user) return message.channel.send('`Error 404` - User has not registered yet.');

    if(!args.join(' ')) {
     await message.channel.send('Type out Intro You Would Like To Display Here!\n\nhttps://ashutosh.why-am-i-he.re/SqOPmh.png\nNote:__*Your Intro Will Be Shown in Codeblocks So Refrain From Using Any Unneccessary Symbols*__.\n\nType `cancel` to cancel.')
     const filter = m => m.content && !m.author.bot && m.author.id == message.author.id;
     const collector = message.channel.createMessageCollector(filter, { time: 600000});
    
      collector.on('collect', async m => {
      if(m.content.length > 1001) {
        await message.channel.send('Intro Exceeded The Limit Of `1000` Charcters as it is `'+m.content.length+' characters Long. Type The Intro Again');
        collector.emit('collect');
      }        
    else if(m.content.toLowerCase() === 'cancel') {
      await collector.stop();
      return message.channel.send('`Cancelled` The Command.')
    }
       else { collector.stop();
          await user.updateOne({$set: {intro: m.content}})
        return message.channel.send('Your Intro Has Been Set As\n```prolog\n'+m.content+'```')   
            }
      });
    }
    else if(args[0] == 'reset') {
      await user.updateOne({$set: {intro: ''}})
        return message.channel.send('Your Intro Has Been Resetted')   
    }
    else {
      if(args.join(' ').length > 1001) return message.channel.send('Intro Exceeded The Limit Of `1000` Charcters as it is `'+args.join(' ').length+'`characters Long. Retry The Command.');

await user.updateOne({$set: {intro: args.join(' ')}})
        return message.channel.send('Your Intro Has Been Set As\n```prolog\n'+args.join(' ')+'```')        
    }
  },
}
