const uploadSchema = require('../../schema/upload.js');
const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js')
module.exports = {
	name: 'profile',
	description: 'View The Profile Of User',
	guildOnly: true,
	usage: ['+profile <id>', '+profile <@mention>'],
	aliases: [],
	module: 'Basic',
	example:['+profile @Ashutosh', '+profile 3169456879456213'],
	async execute(client, message, args) {
    let userViewAble;
    if(args.join(' ')) {
    try { 
    if(message.mentions.users.size !== 0) {
      userViewAble = await message.guild.fetchMember(await client.methods.parseMention(args[0]));
    }
      else userViewAble = await message.guild.fetchMember(args[0]);
    }
    catch(err) { 
	return message.channel.send('Couldn\'t find user matching with input provided `'+ args[0] +'`');
    }
    }
    else userViewAble = message.member;
    
    const user = await userSchema.findById(userViewAble.user.id);
    if(!user) return message.channel.send('`Error 404` - User Has Not Registered Yet.')
    
    const upload = await uploadSchema.find({id: userViewAble.user.id})
    
    const liked = [];
    
    for(const docs of upload) {
      await liked.push(docs.likes.length)
    }
    
    const mostLiked = Math.max(...liked)
    
    const index = liked.indexOf(mostLiked)
    
    const mostLikedDoc = upload[index];
        
    const profile = new Discord.RichEmbed().setAuthor(userViewAble.user.username+'\'s Profile', userViewAble.user.displayAvatarURL)
    .setColor('#7289da').setTimestamp()
    .addField('Username', '`@'+userViewAble.displayName+'`', true).addField('Unique Tag', `\`${userViewAble.user.tag}\``, true)
    .addField('Total Uploads', `\`${user.uploads.length}\``, true).addField('Total Followers', `\`${user.followers.length}\``, true)
    .addField('Most Liked Upload', '`'+mostLikedDoc.likes.length+' Likes`\n[Most Liked Upload\'s Image URL]('+mostLikedDoc.url+')', true).setThumbnail(userViewAble.user.avatarURL)
    .setFooter('React To Follow This person | Un-Verified Account', 'https://cdn.discordapp.com/emojis/446704973628309515.png');
    
    if(user.intro !== '') profile.setDescription('```prolog\n'+user.intro+'```')
    const msg = await message.channel.send(profile);
   await msg.react('446704973628309515');
    const followFilter = (reaction, user) => reaction.emoji.id === '446704973628309515' && user.id === message.author.id;
    const follow = msg.createReactionCollector(followFilter);
    
    follow.on('collect', async() => {
           
      await msg.reactions.find(x => x.emoji.id == '446704973628309515').remove(message.author.id)
      if(message.author.id == userViewAble.user.id) return message.channel.send('You Cannot Follow Yourself :shrug:').then(m => m.delete(5000))
      
     const user = await userSchema.findById(userViewAble.user.id);
      if(user.followers.includes(message.author.id)) {
      await user.updateOne({$pull: {followers : message.author.id} })
       msg.embeds[0].fields[3].value = `\`${user.followers.length-1}\``; 
       const updatedProfile = new Discord.RichEmbed(msg.embeds[0]) 
        await msg.edit(updatedProfile);
        return message.channel.send(message.author+` \`(${message.author.tag})\`, You stopped \`Following\` **${userViewAble.user.tag}**`).then(m => m.delete(6000))
      }
       msg.embeds[0].fields[3].value = `\`${user.followers.length+1}\``; 
       const updatedProfile = new Discord.RichEmbed(msg.embeds[0]) 
        await msg.edit(updatedProfile);
      await user.updateOne({$push: {followers : message.author.id} })
        return message.channel.send(message.author+` \`(${message.author.tag})\`, You started \`Following\` **${userViewAble.user.tag}**`).then(m => m.delete(6000))
      
    });
    
  },
}
