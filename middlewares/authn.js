import jwt from 'jsonwebtoken';
import config from 'config';

async function authn(req, res, next) {
    try {
        const token = req.header(config.get('authTokenName'));
        if (!token) return res.status(401).send('Access denied. No token provided.');

        const payload = jwt.decode(token, config.get('jwtPrivateKey'), { complete: true });
       
        let dateNow = new Date();
        if (!payload.exp) throw new Error();
        if (payload.exp < dateNow.getTime()/1000) throw new Error('TokenExpiredError');
        await jwt.verify(token, config.get('jwtPrivateKey'));
        
        req.user = payload;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') return res.status(401).send('Token expierd.');
        
        res.status(400).send('Invalid token.');
    }
}

export { authn };