const util = require('util');
const fs = require('fs');

const fsExists = util.promisify(fs.exists);
const fsMkdir = util.promisify(fs.mkdir);
const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);

module.exports = {
    fsExists,
    fsMkdir,
    fsWriteFile,
    fsUnlink
};
