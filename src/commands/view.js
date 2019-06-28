const uploadSchema = require('../../schema/upload.js');
const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js')
module.exports = {
	name: 'view',
	description: 'View The Gallery Of User',
	guildOnly: true,
	usage: ['+view <id>', '+view <@mention>'],
	aliases: [],
	module: 'Basic',
	example:['+view @Ashutosh', '+view 3169456879456213'],
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
    
    const viewEmbed = new Discord.RichEmbed()
    .setTitle('Gallery of '+ userViewAble.user.tag, userViewAble.user.displayAvatarURL)
    .setDescription('\n\n**React with :heart: to Like the post.**\nReacting Again Will Remove The Like.').addBlankField().setColor('#7289da').setTimestamp();
    
        const user = await userSchema.findById(userViewAble.user.id);
    if(!user) return message.channel.send('`Error 404` - User has not registered yet.');
    if(user.uploads.length == 0) {
      viewEmbed.setDescription('No Uploads Available :(')
      .setFooter('0 Uploads')
      return message.channel.send(viewEmbed)
    }
    
    const size = user.uploads.length;
   let i = 0;
        
    async function updateEmbed(index) {
      const uploaded = await uploadSchema.findOne({url: user.uploads[index]});
      viewEmbed.setImage(user.uploads[index]);
      await viewEmbed.setFooter('Page ['+(index+1)+' of '+ user.uploads.length+'] | React ❤ To Like The Upload | '+ uploaded.likes.length + ' Liked The Post')
      return viewEmbed;
    }
    const msg = await message.channel.send(await updateEmbed(i))
    await msg.react('❤');
    
    const likeFilter = (reaction, user) => reaction.emoji.name === '❤' && user.id === message.author.id;
    const like = msg.createReactionCollector(likeFilter);
    like.on('collect', async () => {
      const uploaded = await uploadSchema.findOne({url: user.uploads[i]});
      
      await msg.reactions.find(x => x.emoji.name == '❤').remove(message.author.id)
     
      if(uploaded.likes.includes(message.author.id)) {
      await uploaded.updateOne({$pull: {likes : message.author.id} })
        await viewEmbed.setFooter('Page ['+(i+1)+' of '+ user.uploads.length+'] | React ❤ To Like The Upload | '+ (uploaded.likes.length-1) + ' Liked The Upload')
        await msg.edit(viewEmbed);
        return message.channel.send(message.author+` \`(${message.author.tag})\`, Your \`Like\` is removed from this upload`).then(m => m.delete(6000))
      }
      
      else {
        await uploaded.updateOne({$push: {likes: message.author.id}})
        await viewEmbed.setFooter('Page ['+(i+1)+' of '+ user.uploads.length+'] | React ❤ To Like The Upload | '+ (uploaded.likes.length+1) + ' Liked The Upload')
        await msg.edit(viewEmbed);
        return message.channel.send(message.author+` \`(${message.author.tag})\`, Your \`Like\` is added to this upload`).then(m => m.delete(6000))
      }
      
                         
    })
    
    if(size == 1) return;
    await msg.react('⏩').then(() => msg.react('⏪'));
    
    const FFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;
    const BFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
    
    const forward = msg.createReactionCollector(FFilter);
    const backward = msg.createReactionCollector(BFilter);
    
    forward.on('collect', async () => {
     await msg.reactions.find(x => x.emoji.name == '⏩').remove(message.author.id)
      if(i == user.uploads.length) return;
      i++;
     await msg.edit(await updateEmbed(i))
    });
    
    backward.on('collect', async () => {
      await msg.reactions.find(x => x.emoji.name == '⏪').remove(message.author.id)
      if(i == 0) return;
      i--;
      await msg.edit(await updateEmbed(i))
    })
       },
}
