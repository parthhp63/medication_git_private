
const db = require("../database/models");   
const jwt=require('jsonwebtoken')

async function  otpService(req,res,flag){
    console.log('in opt service fn');
    console.log('flag------',flag);
    const makesession=flag;
    console.log('opt service function calling');
    console.log(req.body);
    const user=await db.sequelize.models.users.findOne({ where: { email: `${req.body.email}` } })
    if(user==null){
        return res.status(401).json({message:"Wrong OTP"})

    }
    else{
        const a=(`${req.body.otp1}`+`${req.body.otp2}`+`${req.body.otp3}`+`${req.body.otp4}`)
       if(a==user.otp){
        const query=await db.sequelize.models.users.update({ isActivated:1 },
            {
                where: {
                    email:`${req.body.email}`
                    },
                    },)
                    if(makesession==true){
                        let payload={
                            id:user.id
                        }
                        const token=await jwt.sign(payload,'Patil12',{expiresIn:'1h'});

                        console.log('req.cookie',`${token}`);
                        
                        const session={
                            user_id:user.id,
                            session:token,
                            // email:``
                        }
                        // await db.sequelize.models.sessions.create(session);
        
                    }
                return  res.status(200).send({ status: 'ok' });

       }else{
        return res.status(401).json({message:"Wrong OTP"})
       }
    }

}

module.exports= {otpService} ;