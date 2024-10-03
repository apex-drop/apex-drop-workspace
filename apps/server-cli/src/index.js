#!/usr/bin/env node

const chalk = require("chalk");
const { createSyncServer } = require("apex-drop-server-core");

createSyncServer()
  .then(({ addresses }) => {
    console.log(chalk.bold.green("Sync Server is up and running\n"));

    addresses.forEach((address) => {
      console.log(`${chalk.blue("[ADDR]")} ${chalk.bold.yellow(address)}`);
    });
  })
  .catch((e) => {
    console.log(chalk.bold.red("Failed to Start Sync Server\n"));

    console.log(
      chalk.yellow(
        "Please ensure the server isn't running already. You should restart your computer if the problem persists. \n"
      )
    );
  });
