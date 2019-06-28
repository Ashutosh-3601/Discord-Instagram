const uploadSchema = require('../../schema/upload.js');
const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js');
const isImage = require('is-image-url');
module.exports = {
	name: 'upload',
	description: 'Uploads The Photo',
	guildOnly: true,
	usage: ['+upload <url>', '+upload <attachment>'],
	aliases: ['+post'],
	module: 'Basic',
	example:['+upload https://ashutosh.why-am-i-he.re/random.png', '+upload <attachment>'],
	async execute(client, message, args) {
    const uploaded = new Discord.RichEmbed().setTitle('Uploaded', message.author.displayAvatarURL).setDescription(`Uploaded Your Image :heart:`)
        .setColor('#7289da').setTimestamp().setFooter('0 Likes');
    let url;
    try {
    const user = await userSchema.findById(message.author.id);
      if(!user) {
        return message.channel.send('Oho! You are new to Discord-Instagram.\n**Create Account by doing** `+register`.')
      }
      if(!args.join(' ')) {
        if(message.attachments.size === 0) {
          return message.channel.send('You have neither provided an `URL` nor uploaded an `Attachment`.')
        }
        if(!['png', 'jpg', 'jpeg', 'gif'].includes(message.attachments.map(x => x.filename.split('.')[1])[0])) { return message.channel.send('You probably have not uploaded an image :(')}
        
        url = message.attachments.map(x => x.proxyURL)[0];
        const upload = new uploadSchema({
           id: message.author.id,
            url: message.attachments.map(x => x.proxyURL)[0],
            likes: [],
        });
        await upload.save();
        uploaded.setImage(message.attachments.map(x => x.url)[0])
        
        await user.uploads.push(url);
        await user.save();
        return message.channel.send(uploaded)
      }
      
      if(!isImage(args[0])) return message.channel.send('You probably have not given an image URL :( ')
        url = args[0];
      const upload = new uploadSchema({
           id: message.author.id,
            url: args[0],
            likes: [],
        });
        await upload.save();
        uploaded.setImage(args[0])
        
      await user.uploads.push(url)
      await user.save();
        return message.channel.send(uploaded)
      }

    
    catch(err) {
      return message.channel.send(JSON.stringify(err))
    }
  },
    
  }
