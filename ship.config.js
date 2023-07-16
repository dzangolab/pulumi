module.exports = {
  appName: "@dzangolab/pulumi",
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => {
    return `${defaultCommand} --access public`;
  }
};
