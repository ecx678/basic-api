const fs = require('fs').promises;
async function writetofile(name, text) {
    await fs.writeFile('users.json', 'some stuff')
}
async function appendtofile(name, text) {
    try {
        await fs.writeFile('users.json', 'some stuff')
        return 'done';
    } catch (error) {
        return error;
    }
}

module.exports(
    appendtofile,
    writetofile

)
