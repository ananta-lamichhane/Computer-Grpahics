const fs = require("fs");
const util = require('util');

const read = util.promisify(fs.readFile);

module.exports = function plugin(snowpackConfig, options = {}) {
  return {
    name: 'plugin-txt-export-string',
    resolve: {
      input: options.input || ['.txt'],
      output: ['.js'],
    },
    async load({filePath}) {
      const contents = await read(filePath);
      return `export default \`${contents}\`;`;
    },
  };
};
