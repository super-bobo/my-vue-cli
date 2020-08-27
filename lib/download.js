const { promisify } = require("util");
const download = promisify(require("download-git-repo"));
const ora = require("ora");
module.exports.clone = async function clone(repo, desc) {
  const process = ora(`正在下载....${repo}`);
  process.start();
  try {
    await download(repo, desc);
    process.succeed();
  } catch (error) {
    process.fail();
  }
};
