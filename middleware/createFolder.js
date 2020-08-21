const path = require('path');
const appRoot = require('../appRoot');
const promisify = require('../util/promisify');

module.exports = async (req, res, next) => {
    try {
        const pathUserFolderFile = path.join(appRoot, 'files', req.body.userId);
        const isExists = await promisify.fsExists(pathUserFolderFile);
        if (!isExists) await promisify.fsMkdir(pathUserFolderFile);

        next();
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
