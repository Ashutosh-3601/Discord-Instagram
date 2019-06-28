const uploadSchema = require('../../schema/upload.js');
const userSchema = require('../../schema/userSchema.js');
const Discord = require('discord.js')
module.exports = {
	name: 'delete',
	description: 'View The Your Uploads',
	guildOnly: true,
	usage: ['+delete'],
	aliases: [],
	module: 'Basic',
	example:['+delete'],
async execute(client, message, args) {
  let viewEmbed = new Discord.RichEmbed()
    .setTitle('Deleting Uploads of '+ message.author.tag, message.author.displayAvatarURL)
    .setDescription('**\n\nReact with :wastebasket: to Delete the post.**\nThis Action is irreversible').addBlankField().setColor('#7289da').setTimestamp();
    
        let user = await userSchema.findById(message.author.id);
    if(!user) return message.channel.send('`Error 404` - User has not registered yet.');
    if(user.uploads.length == 0) {
      viewEmbed.setDescription('No Uploads Available :(')
      .setFooter('0 Uploads')
      return message.channel.send(viewEmbed)
    }
    
    const size = user.uploads.length;
   let i = 0;
     async function updateUser() {
      return await userSchema.findById(message.author.id);
     }   
    async function updateEmbed(index) {
      user = await updateUser();
      const uploaded = await uploadSchema.findOne({url: user.uploads[index]});
      if(!user.uploads[index]) return;
      viewEmbed.setImage(user.uploads[index]);
      await viewEmbed.setFooter('React to cancel. | React 🗑 To Delete The Upload | Page ['+(index+1)+' of '+ user.uploads.length+'] |','https://cdn.discordapp.com/emojis/446704972780797954.png')
      return viewEmbed;
    }
  
    const msg = await message.channel.send(await updateEmbed(i));
    await msg.react('🗑').then(()=> msg.react('446704972780797954'));
  
  const deleteFilter = (reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id;
    const deleter = msg.createReactionCollector(deleteFilter);
  
  const cancelFilter = (reaction, user) => reaction.emoji.id === '446704972780797954' && user.id === message.author.id;
    const cancel = msg.createReactionCollector(cancelFilter);
  
  cancel.on('collect', async () => {
    await msg.delete(1000).then(m => m.channel.send('Cancelled The Deletion.'))
  });
  
    deleter.on('collect', async () => {
            await msg.reactions.find(x => x.emoji.name == '🗑').remove(message.author.id)
      await uploadSchema.deleteOne({url: user.uploads[i]});
           
      await user.updateOne({$pull: {uploads : user.uploads[i] }});
      
      user = await updateUser();
         if(user.uploads.length == 0) {
        message.channel.send('Deleted Upload');
        return msg.delete();
      }
      if(user.uploads.length > i)  i = i+1; 
      else i = i - 1;
viewEmbed = await updateEmbed(i);
    await msg.edit(viewEmbed);
        return message.channel.send(message.author+` \`(${message.author.tag})\`, You \`Deleted\` this upload`).then(m => m.delete(6000))                           
    })
    
    if(size == 1) return;
    await msg.react('⏩').then(() => msg.react('⏪'));
    
    const FFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;
    const BFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
    
    const forward = msg.createReactionCollector(FFilter);
    const backward = msg.createReactionCollector(BFilter);
    
    forward.on('collect', async () => {
      user = await updateUser();
     await msg.reactions.find(x => x.emoji.name == '⏩').remove(message.author.id);
      if(i == user.uploads.length) return;
      i++;
     await msg.edit(await updateEmbed(i))
    });
    
    backward.on('collect', async () => {
      user = await updateUser();
      await msg.reactions.find(x => x.emoji.name == '⏪').remove(message.author.id)
      if(i == 0) return;
      i--;
      await msg.edit(await updateEmbed(i))
    })
    },
}
