import jwt from 'jsonwebtoken';

const withAuth = (req, res, next) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.header['x-access-token'] ||
        req.cookies.token;

    if(!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                res.status(401).send('Unauthroized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
}

export default withAuth;