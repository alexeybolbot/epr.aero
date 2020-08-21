const bcrypt = require('bcrypt');
const moment = require('moment');
const uuidv4 = require('uuid').v4;
const User = require('../models/user');
const Token = require('../models/token');

exports.signup = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(200).json({ message: 'Empty data' });

        const user = await User.findByPk(id);
        if (user) return res.status(409).json({ message: 'id exists' });

        const hash = await bcrypt.hash(password, 10);
        await User.create({ id, password: hash });

        const { accessToken, refreshToken } = await createToken(id);

        res.status(200).json({ accessToken, refreshToken });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

async function createToken(userId) {
    const accessToken = uuidv4();
    const refreshToken = uuidv4();
    const expiresAt = moment().add(10, 'minute').toDate();

    await Token.create({
        accessToken,
        refreshToken,
        expiresAt,
        userId
    });

    return { accessToken, refreshToken };
}

exports.signin = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!id || !password) return res.status(200).json({ message: 'Empty data' });

        const user = await User.findByPk(id);
        if (!user) return res.status(401).json({ message: 'Auth failed' });

        const isCheckPassword = await bcrypt.compare(password, user.password);
        if (!isCheckPassword) return res.status(401).json({ message: 'Auth failed' });

        await Token.destroy({ where: { userId: id } });
        const { accessToken, refreshToken } = await createToken(id);

        res.status(200).json({ accessToken, refreshToken });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.newToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(200).json({ message: 'Empty data' });

        const token = await Token.findOne({ where: { refreshToken }, raw: true });
        if (!token) return res.status(200).json({ message: 'No token' });

        const userId = token.userId;
        await Token.destroy({ where: { userId } });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await createToken(userId);

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.info = async (req, res) => {
    try {
        res.status(200).json({ id: req.body.userId });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];

        await Token.destroy({ where: { accessToken } });

        res.status(200).json({ message: 'Logout' });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
};
