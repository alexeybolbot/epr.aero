const moment = require('moment');
const Token = require('../models/token');

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const token = await Token.findOne({ where: { accessToken }, raw: true });
        if (!token) return res.status(401).json({ message: 'Auth failed' });

        const isExpiresAt = moment().isAfter(token.expiresAt);
        if (isExpiresAt) return res.status(401).json({ message: 'Auth failed' });

        req.body.userId = token.userId;

        next();
    } catch (e) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};
