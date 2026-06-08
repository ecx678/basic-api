const { json } = require('body-parser');

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
async function GetUserByName(name) {
    const filedataraw = await fs.readFile('/workspaces/basic-api/users.json')
    const ParsedData = JSON.parse(filedataraw);
    const DataFound = ParsedData[name];
    return DataFound
}
async function UserMatchesPassword(user) {
    const password = user.password;
    const username = user.username;
    if (await GetUserByName(username).password === (password)) {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    appendtofile,
    writetofile,
    UserMatchesPassword,
    GetUserByName
}
