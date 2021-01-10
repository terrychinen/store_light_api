import jsonWebToken from 'jsonwebtoken';

export const tokenValidation = (req, res, next) => {
    let token = req.get('token');
    
    jsonWebToken.verify(token, process.env.TOKEN_SECRET, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                message: err
            });
        }
    
        req.user = decoded.user;
        next();    

    });  
    
}