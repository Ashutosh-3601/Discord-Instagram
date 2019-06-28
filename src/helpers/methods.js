module.exports = {
  parseMention: async (mention) => {
    const matches = mention.match(/^<@!?(\d+)>$/);
    const id = matches[1];
if(!id) id = undefined;
    return id;
    },
}
