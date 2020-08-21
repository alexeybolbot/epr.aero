const path = require('path');
const appRoot = require('../appRoot');
const moment = require('moment');
const uuidv4 = require('uuid').v4;
const fs = require('fs');
const promisify = require('../util/promisify');
const File = require('../models/file');

exports.upload = async (req, res) => {
    try {
        if (req && req.files && req.files.file) {
            const file = req.files.file;
            const { name, extension } = getNameAndExtension(file);
            const mimetype = file.mimetype;
            const size = file.size;
            const date = moment().toDate();
            const linkName = `${uuidv4()}.${extension}`;
            const dir = path.join(appRoot, 'files', req.body.userId, linkName);

            await promisify.fsWriteFile(dir, file.data);

            const userId = req.body.userId;
            await File.create({
                name,
                extension,
                mimetype,
                size,
                date,
                linkName,
                userId
            });

            res.status(200).json({ message: 'File upload' });
        } else {
            return res.status(200).json({ message: 'No file' });
        }
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

function getNameAndExtension(file) {
    const arr = file.name.split('.');
    const extension = arr[arr.length-1];
    arr.splice(arr.length-1, 1);
    const name = arr.join('.');

    return { name, extension };
}

exports.list = async (req, res) => {
    try {
        console.log('req.query', req.query);
        const userId = req.body.userId;
        const limit = +req.query.list_size || 10;
        const page = +req.query.page || 1;
        const offset = (page - 1) * limit;
        const files = await File.findAll({ where: { userId },
            limit,
            offset,
            raw: true
        });

        files.forEach((file) => {
            delete file.linkName;
            delete file.userId;
        });

        return res.status(200).json({ files });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findOne({ where: { id }, raw: true });
        if (!file) return res.status(200).json({ message: 'No file' });

        const dir = path.join(appRoot, 'files', req.body.userId, file.linkName);
        await promisify.fsUnlink(dir);
        await File.destroy({ where: { id } });

        return res.status(200).json({ message: 'Delete' });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.get = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findOne({ where: { id }, raw: true });
        if (!file) return res.status(200).json({ message: 'No file' });

        const { name, extension, mimetype, size, date } = file;

        return res.status(200).json({ name, extension, mimetype, size, date });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.download = async (req, res) => {
    try {
        const id = req.params.id;
        const file = await File.findOne({ where: { id }, raw: true });
        if (!file) return res.status(200).json({ message: 'No file' });

        const filename = `${file.name}.${file.extension}`;
        const mimetype = file.mimetype;
        const dir = path.join(appRoot, 'files', req.body.userId, file.linkName);

        res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename));
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(dir);
        filestream.pipe(res);
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        if (req && req.files && req.files.file) {
            const id = req.params.id;
            const oldFile = await File.findOne({ where: { id }, raw: true });
            if (!oldFile) return res.status(200).json({ message: 'No file' });

            const oldDir = path.join(appRoot, 'files', req.body.userId, oldFile.linkName);
            const newFile = req.files.file;
            const { name, extension } = getNameAndExtension(newFile);
            const mimetype = newFile.mimetype;
            const size = newFile.size;
            const date = moment().toDate();
            const linkName = `${uuidv4()}.${extension}`;
            const newDir = path.join(appRoot, 'files', req.body.userId, linkName);

            await promisify.fsWriteFile(newDir, newFile.data);
            await File.update({
                name,
                extension,
                mimetype,
                size,
                date,
                linkName
            }, { where: { id } });

            await promisify.fsUnlink(oldDir);

            res.status(200).json({ message: 'File update' });
        } else {
            return res.status(200).json({ message: 'No file' });
        }
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};
