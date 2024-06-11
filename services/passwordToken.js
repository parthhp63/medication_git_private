const password = require("../controller/password");
const db = require("../database/models");

const user=await db.sequelize.models.findOne({where:{ email: `${req.body.email}` }})
if(user==null){
    return res.status(401).json({message:"Wrong Credentials"})
}
else if(user!==null){

let payload={
    id:user.id
}
const token=await jwt.sign(payload,'Parth12',{expiresIn:'1h'});
res.cookie('token',token,{
    httpOnly:true,
    maxAge:360000
})
console.log('req.cookie',`${token}`);

const session={
    user_id:user.id,
    session:token,
    email:`${req.body.email}`
}
}
await db.sequelize.models.sessions.create(session);
// console.log(session);
return  res.status(200).send({ status: 'ok' });
