const templateList = ['basic-typescript-template']

const questions = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: templateList,
    },
    {
        name: 'projectName',
        type: 'input',
        message: 'Project name:',
        validate: (input: string) => {
            if (/^([a-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

export default questions