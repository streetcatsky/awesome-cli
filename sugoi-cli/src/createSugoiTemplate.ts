'use strict';

import https from 'https'
import chalk from 'chalk'
import commander from 'commander'
import axios from 'axios'
import dns from 'dns'
import { execSync } from 'child_process';
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import semver from 'semver'
import spawn from 'cross-spawn'
import tmp from 'tmp'
import * as inquirer from 'inquirer';
import url from 'url'
import validateProjectName from 'validate-npm-package-name'
import figlet from 'figlet'
import packageJson from '../package.json';
import questions from './utils/question';

let projectName: string;



export default class CreateSugoiTemplate {

  private projectName!: string;

  constructor() {

    this.showWelcomeMessage()
    this.askUesr()

  }

  showWelcomeMessage() {

    console.log(figlet.textSync('Sugoi CLI!', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }));

    console.log()

    console.log(
      `  ${chalk.cyan('version')} ${chalk.green(packageJson.version)}`
    );
    console.log()
  }
  async askUesr() {

    const answers = await inquirer.prompt(questions)

    console.log(answers)
  }
}
// async function init() {

//   const program = new commander.Command(packageJson.name)
//     .version(packageJson.version)
//     .arguments('<project-directory>')
//     .usage(`${chalk.green('<project-directory>')} [options]`)
//     .action(name => {
//       projectName = name;
//     })
//     .on('--help', () => {
//       console.log(
//         `    I can't help you .😅`
//       );
//     })
//     .parse(process.argv);


//   if (typeof projectName === 'undefined') {
//     console.error('Please specify the project directory:');
//     console.log(
//       `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
//     );
//     console.log();
//     console.log('For example:');
//     console.log(
//       `  ${chalk.cyan(program.name())} ${chalk.green('my-sugoi-app')}`
//     );
//     console.log();
//     console.log(
//       `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
//     );
//     process.exit(1);
//   }


//   try {

//     const latest = await checkForLatestVersion();

//     if (latest && semver.lt(packageJson.version, latest)) {
//       console.log();
//       console.error(
//         chalk.yellow(
//           `You are running \`sugoi-cli\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
//           'We no longer support global installation of sugoi-cli.'
//         )
//       );
//       console.log();
//       console.log(
//         'Please remove any global installs with one of the following commands:\n' +
//         '- npm uninstall -g sugoi-cli\n' +
//         '- yarn global remove sugoi-cli'
//       );
//       console.log();
//       process.exit(1);
//     } else {

//       console.log('ready to createApp')
// createApp(
//   projectName,

// );
//     }
//   } catch (error) {
//     process.exit(1);
//   }

// }

// function createApp(projectName:string) {


//   const root = path.resolve(projectName);

//   console.log('root: ',root)

//   checkAppName(projectName);
//   fs.ensureDirSync(projectName);

// console.log(`Creating a new sugoi template in ${chalk.green(root)}.`);
// console.log();

// const packageJson = {
//   name: appName,
//   version: '0.1.0',
//   private: true,
// };
// fs.writeFileSync(
//   path.join(root, 'package.json'),
//   JSON.stringify(packageJson, null, 2) + os.EOL
// );

// const originalDirectory = process.cwd();
// process.chdir(root);
// if (!checkThatNpmCanReadCwd()) {
//   process.exit(1);
// }

//   const npmInfo = checkNpmVersion();
//   if (!npmInfo.hasMinNpm) {
//     if (npmInfo.npmVersion) {
//       console.log(
//         chalk.yellow(
//           `You are using npm ${npmInfo.npmVersion} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
//             `Please update to npm 6 or higher for a better, fully supported experience.\n`
//         )
//       );
//     }
//   }

//   run(
//     root,
//     appName,
//     version,
//     verbose,
//     originalDirectory,
//     template,
//     usePnp
//   );
//}

// function install(root, useYarn, usePnp, dependencies, verbose, isOnline) {
//   return new Promise((resolve, reject) => {
//     let command;
//     let args;
//     if (useYarn) {
//       command = 'yarnpkg';
//       args = ['add', '--exact'];
//       if (!isOnline) {
//         args.push('--offline');
//       }
//       if (usePnp) {
//         args.push('--enable-pnp');
//       }
//       [].push.apply(args, dependencies);

//       // Explicitly set cwd() to work around issues like
//       // https://github.com/facebook/sugoi-cli/issues/3326.
//       // Unfortunately we can only do this for Yarn because npm support for
//       // equivalent --prefix flag doesn't help with this issue.
//       // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
//       args.push('--cwd');
//       args.push(root);

//       if (!isOnline) {
//         console.log(chalk.yellow('You appear to be offline.'));
//         console.log(chalk.yellow('Falling back to the local Yarn cache.'));
//         console.log();
//       }
//     } else {
//       command = 'npm';
//       args = [
//         'install',
//         '--save',
//         '--save-exact',
//         '--loglevel',
//         'error',
//       ].concat(dependencies);

//       if (usePnp) {
//         console.log(chalk.yellow("NPM doesn't support PnP."));
//         console.log(chalk.yellow('Falling back to the regular installs.'));
//         console.log();
//       }
//     }

//     if (verbose) {
//       args.push('--verbose');
//     }

//     const child = spawn(command, args, { stdio: 'inherit' });
//     child.on('close', code => {
//       if (code !== 0) {
//         reject({
//           command: `${command} ${args.join(' ')}`,
//         });
//         return;
//       }
//       resolve();
//     });
//   });
// }

// function run(
//   root,
//   appName,
//   version,
//   verbose,
//   originalDirectory,
//   template,
//   usePnp
// ) {
//   Promise.all([
//     getInstallPackage(version, originalDirectory),
//     getTemplateInstallPackage(template, originalDirectory),
//   ]).then(([packageToInstall, templateToInstall]) => {
//     const allDependencies = [packageToInstall];

//     console.log('Installing packages. This might take a couple of minutes.');
//     console.log('packageToInstall: ',packageToInstall)
//     console.log('templateToInstall: ',templateToInstall)
//     Promise.all([
//       getPackageInfo(packageToInstall),
//       getPackageInfo(templateToInstall), 
//     ])
//       .then(([packageInfo, templateInfo]) =>
//         checkIfOnline(useYarn).then(isOnline => ({
//           isOnline,
//           packageInfo,
//           templateInfo,
//         }))
//       )
//   //     .then(({ isOnline, packageInfo, templateInfo }) => {
//   //       let packageVersion = semver.coerce(packageInfo.version);

//   //       const templatesVersionMinimum = '3.3.0';

//   //       // Assume compatibility if we can't test the version.
//   //       if (!semver.valid(packageVersion)) {
//   //         packageVersion = templatesVersionMinimum;
//   //       }

//   //       // Only support templates when used alongside new react-scripts versions.
//   //       const supportsTemplates = semver.gte(
//   //         packageVersion,
//   //         templatesVersionMinimum
//   //       );
//   //       if (supportsTemplates) {
//   //         allDependencies.push(templateToInstall);
//   //       } else if (template) {
//   //         console.log('');
//   //         console.log(
//   //           `The ${chalk.cyan(packageInfo.name)} version you're using ${
//   //             packageInfo.name === 'react-scripts' ? 'is not' : 'may not be'
//   //           } compatible with the ${chalk.cyan('--template')} option.`
//   //         );
//   //         console.log('');
//   //       }

//   //       console.log(
//   //         `Installing ${chalk.cyan('react')}, ${chalk.cyan(
//   //           'react-dom'
//   //         )}, and ${chalk.cyan(packageInfo.name)}${
//   //           supportsTemplates ? ` with ${chalk.cyan(templateInfo.name)}` : ''
//   //         }...`
//   //       );
//   //       console.log();

//   //       return install(
//   //         root,
//   //         useYarn,
//   //         usePnp,
//   //         allDependencies,
//   //         verbose,
//   //         isOnline
//   //       ).then(() => ({
//   //         packageInfo,
//   //         supportsTemplates,
//   //         templateInfo,
//   //       }));
//   //     })
//   //     .then(async ({ packageInfo, supportsTemplates, templateInfo }) => {
//   //       const packageName = packageInfo.name;
//   //       const templateName = supportsTemplates ? templateInfo.name : undefined;
//   //       checkNodeVersion(packageName);
//   //       setCaretRangeForRuntimeDeps(packageName);

//   //       const pnpPath = path.resolve(process.cwd(), '.pnp.js');

//   //       const nodeArgs = fs.existsSync(pnpPath) ? ['--require', pnpPath] : [];

//   //       await executeNodeScript(
//   //         {
//   //           cwd: process.cwd(),
//   //           args: nodeArgs,
//   //         },
//   //         [root, appName, verbose, originalDirectory, templateName],
//   //         `
//   //       var init = require('${packageName}/scripts/init.js');
//   //       init.apply(null, JSON.parse(process.argv[1]));
//   //     `
//   //       );


//   //     })
//   //     .catch(reason => {
//   //       console.log();
//   //       console.log('Aborting installation.');
//   //       if (reason.command) {
//   //         console.log(`  ${chalk.cyan(reason.command)} has failed.`);
//   //       } else {
//   //         console.log(
//   //           chalk.red('Unexpected error. Please report it as a bug:')
//   //         );
//   //         console.log(reason);
//   //       }
//   //       console.log();

//   //       // On 'exit' we will delete these files from target directory.
//   //       const knownGeneratedFiles = [
//   //         'package.json',
//   //         'yarn.lock',
//   //         'node_modules',
//   //       ];
//   //       const currentFiles = fs.readdirSync(path.join(root));
//   //       currentFiles.forEach(file => {
//   //         knownGeneratedFiles.forEach(fileToMatch => {
//   //           // This removes all knownGeneratedFiles.
//   //           if (file === fileToMatch) {
//   //             console.log(`Deleting generated file... ${chalk.cyan(file)}`);
//   //             fs.removeSync(path.join(root, file));
//   //           }
//   //         });
//   //       });
//   //       const remainingFiles = fs.readdirSync(path.join(root));
//   //       if (!remainingFiles.length) {
//   //         // Delete target folder if empty
//   //         console.log(
//   //           `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
//   //             path.resolve(root, '..')
//   //           )}`
//   //         );
//   //         process.chdir(path.resolve(root, '..'));
//   //         fs.removeSync(path.join(root));
//   //       }
//   //       console.log('Done.');
//   //       process.exit(1);
//   //     });
//    });
// }

// function getInstallPackage(version, originalDirectory) {
//   let packageToInstall = 'sugoi-scripts';
//   const validSemver = semver.valid(version);
//   if (validSemver) {
//     packageToInstall += `@${validSemver}`;
//   } else if (version) {
//     if (version[0] === '@' && !version.includes('/')) {
//       packageToInstall += version;
//     } else if (version.match(/^file:/)) {
//       packageToInstall = `file:${path.resolve(
//         originalDirectory,
//         version.match(/^file:(.*)?$/)[1]
//       )}`;
//     } else {
//       // for tar.gz or alternative paths
//       packageToInstall = version;
//     }
//   }

//   return Promise.resolve(packageToInstall);
// }

// function getTemplateInstallPackage(template, originalDirectory) {
//   let templateToInstall = 'basic-typescript-template';
//   if (template) {
//     if (template.match(/^file:/)) {
//       templateToInstall = `file:${path.resolve(
//         originalDirectory,
//         template.match(/^file:(.*)?$/)[1]
//       )}`;
//     } else if (
//       template.includes('://') ||
//       template.match(/^.+\.(tgz|tar\.gz)$/)
//     ) {
//       // for tar.gz or alternative paths
//       templateToInstall = template;
//     } else {
//       // Add prefix 'cra-template-' to non-prefixed templates, leaving any
//       // @scope/ and @version intact.
//       const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
//       const scope = packageMatch[1] || '';
//       const templateName = packageMatch[2] || '';
//       const version = packageMatch[3] || '';

//       if (
//         templateName === templateToInstall ||
//         templateName.startsWith(`${templateToInstall}-`)
//       ) {
//         // Covers:
//         // - cra-template
//         // - @SCOPE/cra-template
//         // - cra-template-NAME
//         // - @SCOPE/cra-template-NAME
//         templateToInstall = `${scope}${templateName}${version}`;
//       } else if (version && !scope && !templateName) {
//         // Covers using @SCOPE only
//         templateToInstall = `${version}/${templateToInstall}`;
//       } else {
//         // Covers templates without the `cra-template` prefix:
//         // - NAME
//         // - @SCOPE/NAME
//         templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
//       }
//     }
//   }

//   return Promise.resolve(templateToInstall);
// }

// function getTemporaryDirectory() {
//   return new Promise((resolve, reject) => {
//     // Unsafe cleanup lets us recursively delete the directory if it contains
//     // contents; by default it only allows removal if it's empty
//     tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({
//           tmpdir: tmpdir,
//           cleanup: () => {
//             try {
//               callback();
//             } catch (ignored) {
//               // Callback might throw and fail, since it's a temp directory the
//               // OS will clean it up eventually...
//             }
//           },
//         });
//       }
//     });
//   });
// }

// function extractStream(stream, dest) {
//   return new Promise((resolve, reject) => {
//     stream.pipe(
//       unpack(dest, err => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(dest);
//         }
//       })
//     );
//   });
// }

// // Extract package name from tarball url or path.
// function getPackageInfo(installPackage) {
//   if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
//     return getTemporaryDirectory()
//       .then(obj => {
//         let stream;
//         if (/^http/.test(installPackage)) {
//           stream = hyperquest(installPackage);
//         } else {
//           stream = fs.createReadStream(installPackage);
//         }
//         return extractStream(stream, obj.tmpdir).then(() => obj);
//       })
//       .then(obj => {
//         const { name, version } = require(path.join(
//           obj.tmpdir,
//           'package.json'
//         ));
//         obj.cleanup();
//         return { name, version };
//       })
//       .catch(err => {
//         // The package name could be with or without semver version, e.g. react-scripts-0.2.0-alpha.1.tgz
//         // However, this function returns package name only without semver version.
//         console.log(
//           `Could not extract the package name from the archive: ${err.message}`
//         );
//         const assumedProjectName = installPackage.match(
//           /^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/
//         )[1];
//         console.log(
//           `Based on the filename, assuming it is "${chalk.cyan(
//             assumedProjectName
//           )}"`
//         );
//         return Promise.resolve({ name: assumedProjectName });
//       });
//   } else if (installPackage.startsWith('git+')) {
//     // Pull package name out of git urls e.g:
//     // git+https://github.com/mycompany/react-scripts.git
//     // git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
//     return Promise.resolve({
//       name: installPackage.match(/([^/]+)\.git(#.*)?$/)[1],
//     });
//   } else if (installPackage.match(/.+@/)) {
//     // Do not match @scope/ when stripping off @version or @tag
//     return Promise.resolve({
//       name: installPackage.charAt(0) + installPackage.substr(1).split('@')[0],
//       version: installPackage.split('@')[1],
//     });
//   } else if (installPackage.match(/^file:/)) {
//     const installPackagePath = installPackage.match(/^file:(.*)?$/)[1];
//     const { name, version } = require(path.join(
//       installPackagePath,
//       'package.json'
//     ));
//     return Promise.resolve({ name, version });
//   }
//   return Promise.resolve({ name: installPackage });
// }

// function checkNpmVersion() {
//   let hasMinNpm = false;
//   let npmVersion = null;
//   try {
//     npmVersion = execSync('npm --version').toString().trim();
//     hasMinNpm = semver.gte(npmVersion, '6.0.0');
//   } catch (err) {
//     // ignore
//   }
//   return {
//     hasMinNpm: hasMinNpm,
//     npmVersion: npmVersion,
//   };
// }


// function checkNodeVersion(packageName) {
//   const packageJsonPath = path.resolve(
//     process.cwd(),
//     'node_modules',
//     packageName,
//     'package.json'
//   );

//   if (!fs.existsSync(packageJsonPath)) {
//     return;
//   }

//   const packageJson = require(packageJsonPath);
//   if (!packageJson.engines || !packageJson.engines.node) {
//     return;
//   }

//   if (!semver.satisfies(process.version, packageJson.engines.node)) {
//     console.error(
//       chalk.red(
//         'You are running Node %s.\n' +
//           'Create React App requires Node %s or higher. \n' +
//           'Please update your version of Node.'
//       ),
//       process.version,
//       packageJson.engines.node
//     );
//     process.exit(1);
//   }
// }

function checkAppName(appName: string) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach(error => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
}

// function getProxy() {
//   if (process.env.https_proxy) {
//     return process.env.https_proxy;
//   } else {
//     try {
//       // Trying to read https-proxy from .npmrc
//       let httpsProxy = execSync('npm config get https-proxy').toString().trim();
//       return httpsProxy !== 'null' ? httpsProxy : undefined;
//     } catch (e) {
//       return;
//     }
//   }
// }

// // See https://github.com/facebook/sugoi-cli/pull/3355
// function checkThatNpmCanReadCwd() {
//   const cwd = process.cwd();
//   let childOutput = null;
//   try {
//     // Note: intentionally using spawn over exec since
//     // the problem doesn't reproduce otherwise.
//     // `npm config list` is the only reliable way I could find
//     // to reproduce the wrong path. Just printing process.cwd()
//     // in a Node process was not enough.
//     childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
//   } catch (err) {
//     // Something went wrong spawning node.
//     // Not great, but it means we can't do this check.
//     // We might fail later on, but let's continue.
//     return true;
//   }
//   if (typeof childOutput !== 'string') {
//     return true;
//   }
//   const lines = childOutput.split('\n');
//   // `npm config list` output includes the following line:
//   // "; cwd = C:\path\to\current\dir" (unquoted)
//   // I couldn't find an easier way to get it.
//   const prefix = '; cwd = ';
//   const line = lines.find(line => line.startsWith(prefix));
//   if (typeof line !== 'string') {
//     // Fail gracefully. They could remove it.
//     return true;
//   }
//   const npmCWD = line.substring(prefix.length);
//   if (npmCWD === cwd) {
//     return true;
//   }
//   console.error(
//     chalk.red(
//       `Could not start an npm process in the right directory.\n\n` +
//         `The current directory is: ${chalk.bold(cwd)}\n` +
//         `However, a newly started npm process runs in: ${chalk.bold(
//           npmCWD
//         )}\n\n` +
//         `This is probably caused by a misconfigured system terminal shell.`
//     )
//   );
//   if (process.platform === 'win32') {
//     console.error(
//       chalk.red(`On Windows, this can usually be fixed by running:\n\n`) +
//         `  ${chalk.cyan(
//           'reg'
//         )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
//         `  ${chalk.cyan(
//           'reg'
//         )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
//         chalk.red(`Try to run the above two lines in the terminal.\n`) +
//         chalk.red(
//           `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
//         )
//     );
//   }
//   return false;
// }

// function checkIfOnline(useYarn) {
//   if (!useYarn) {
//     // Don't ping the Yarn registry.
//     // We'll just assume the best case.
//     return Promise.resolve(true);
//   }

//   return new Promise(resolve => {
//     dns.lookup('registry.yarnpkg.com', err => {
//       let proxy;
//       if (err != null && (proxy = getProxy())) {
//         // If a proxy is defined, we likely can't resolve external hostnames.
//         // Try to resolve the proxy name as an indication of a connection.
//         dns.lookup(url.parse(proxy).hostname, proxyErr => {
//           resolve(proxyErr == null);
//         });
//       } else {
//         resolve(err == null);
//       }
//     });
//   });
// }


async function checkForLatestVersion() {

  try {

    const result = await axios.get<{ latest: string }>('https://registry.npmjs.org/-/package/sugoi-cli/dist-tags')
    if (result.status === 200) {
      console.log(result.data)
      return result.data.latest

    } else {

      throw 'checkForLatestVersion Error'

    }
  }
  catch (error) {

    throw 'checkForLatestVersion Error'

  }


}


// export {
//   init,
// };