import jwt from 'jsonwebtoken';
import config from 'config';

function auth(req, res, next) {
    try {
        const token = req.header(config.get('authTokenName'));
        if (!token) return res.status(401).send('Access denied. No token provided.');

        const payload = jwt.decode(token, config.get('jwtPrivateKey'), { complete: true });
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid token.');
    }
}

export { auth };