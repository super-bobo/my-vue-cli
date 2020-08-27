const { clone } = require("./download");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const shell = require("shelljs");
const clientUrl =
  "direct:http://192.168.10.36/platform-front-end/st-vue-client-template/-/archive/master/st-vue-client-template-master.zip";
const ssrUrl =
  "direct:http://192.168.10.36/platform-front-end/st-vue-ssr-template/-/archive/master/st-vue-ssr-template-master.zip";
  
async function create(name) {
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, name || ".");
  const { client } = await inquirer.prompt([
    {
      name: "client",
      type: "list",
      message: "Choose how to render. Pick an action:",
      choices: [
        { name: "client", value: true },
        { name: "ssr", value: false }
      ],
      default: true
    }
  ]);
  const downloadUrl = client ? clientUrl : ssrUrl;
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: `Target directory ${chalk.cyan(
          targetDir
        )} already exists. Pick an action:`,
        choices: [
          { name: "Overwrite", value: "overwrite" },
          { name: "Cancel", value: false }
        ]
      }
    ]);
    if (!action) return;
    if (action === "overwrite") {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }
  await clone(downloadUrl, targetDir);

  shell.cd(name);
  shell.exec("npm i", function (code) {
    if (code == "0") {
      try {
        shell.exec("npm run dev");
      } catch (error) {
        shell.echo("Error: npm run dev failed");
        shell.exit(1);
      }
    } else {
      shell.echo("Error: npm install failed");
      shell.exit(1);
    }
  });
}
module.exports = (...args) => {
  return create(...args).catch((err) => {
    process.exit(1);
  });
};
