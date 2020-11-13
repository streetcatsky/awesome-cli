'use strict';

import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'
import * as inquirer from 'inquirer';
import figlet from 'figlet'
import packageJson from '../package.json';
import questions from './utils/question';
import ora from 'ora';
import shell from 'shelljs';
import axios from 'axios'

export default class CreateSugoiTemplate {

  private projectName!: string;
  private template!: string;
  private projectPath!: string;
  private templatePath !: string;
  constructor() {
    this.run()
  }

  async run() {

    // console.log('process.cwd(): ', process.cwd())
    // console.log('__dirname: ', __dirname)
    // console.log('path.resolve(): ', path.resolve())
    // console.log('templates path: ', __dirname.replace(path.basename(__dirname), 'templates'))
    // console.log('current template path: ', path.join(__dirname.replace(path.basename(__dirname), 'templates'), 'basic-typescript-template'))

    this.showWelcomeMessage()
    await this.checkSugoiIsLastVersion()
    await this.askUser()
    await this.createProjectFolder()
    await this.createProjectContents()
    await this.installLibrary()
    await this.writeProjectName()
    this.successMessage()

  }

  showWelcomeMessage() {

    console.log(chalk.yellow(figlet.textSync('Sugoi CLI!', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })));

    console.log()

    console.log(
      `  ${chalk.cyan('Version:')} ${chalk.green(packageJson.version)}`
    );

    console.log(
      `  ${chalk.cyan('Author:')} ${chalk.green('street_cat')}`
    );
    console.log(
      `  ${chalk.cyan('Email:')} ${chalk.green('streetcatsky@gmail.com')}`
    );
    console.log()
  }

  successMessage() {
    console.log(
      `  ${chalk.green(this.template + ' created success.')}`
    );
    console.log()
    console.log(chalk.blue(figlet.textSync('Enjoy !', {
      font: 'Doom',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })));
    console.log()
  }
  async askUser() {

    const answers = await inquirer.prompt(questions)

    this.projectName = answers.projectName;
    this.projectPath = path.resolve(answers.projectName);
    this.template = answers.template
    this.templatePath = path.join(__dirname.replace(path.basename(__dirname), 'templates'), answers.template)

  }

  async checkSugoiIsLastVersion() {

    const spinner = ora('Checking sugoi cli is last version')
    spinner.start()
    const latest = await this.fetchForLatestVersion();

    if (latest && semver.lt(packageJson.version, latest)) {
      console.log();
      console.error(
        chalk.yellow(
          `You are running \`sugoi-cli\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
          'We no longer support global installation of sugoi-cli.'
        )
      );
      console.log();
      console.log(
        'Please remove any global installs with one of the following commands:\n' +
        '- npm uninstall -g sugoi-cli\n' +
        '- yarn global remove sugoi-cli'
      );
      console.log();
      spinner.fail()
      process.exit(1);
    }
    spinner.succeed()
  }

  async fetchForLatestVersion() {
    try {
      const result = await axios.get<{ latest: string }>('https://registry.npmjs.org/-/package/sugoi-cli/dist-tags')
      if (result.status === 200) {
        return result.data.latest
      } else {
        console.error(
          chalk.yellow(`fetchForLatestVersion Error.`)
        );
        process.exit(1)
      }
    }
    catch (error) {
      console.error(
        chalk.yellow(`fetchForLatestVersion Error.`)
      );
      process.exit(1)
    }
  }

  async createProjectFolder() {

    const spinner = ora(`Creating a new sugoi template in ${chalk.green(this.projectPath)}.`)
    spinner.start()
    await fs.ensureDir(this.projectName);
    spinner.succeed()
  }

  async createProjectContents() {
    const spinner = ora(`Creating project contents.`)
    spinner.start()
    shell.cp('-R', this.templatePath + '/*', this.projectPath)
    spinner.succeed()
  }

  async installLibrary() {
    const spinner = ora(`Installing dependencies library.`)
    spinner.start()
    shell.cd(this.projectPath)
    shell.exec('npm i')
    spinner.succeed()
  }

  async writeProjectName() {
    const spinner = ora(`Writing project name to package.json.`)
    spinner.start()
    const result = await fs.readJSON(this.templatePath + '/package.json');
    result.name = this.projectName;
    await fs.writeJSON(this.projectPath + '/package.json', result)
    spinner.succeed()
  }
}
