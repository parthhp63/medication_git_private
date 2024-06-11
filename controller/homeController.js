const db=require("../database/models/index");
const jwt=require('jsonwebtoken')
const mailServices=require("../services/mailServices");
const UserAgent = require('user-agents');  
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");
// const otpGenerator = require('otp-generator');
const otpService = require("../services/otpService");
const otp4Digit = require("../helpers/otpGenerate");

const {users}=db;


const homeController=()=>{
    return{
        async register(req,res){
            res.render("./sections/registration");
        },

        async adduser(req,res){
            try{            
                const active_pin=randomstring.generate(7);
                const emailcheck=await db.sequelize.models.users.findOne({where:{email:`${req.body.email}`}});
                console.log(emailcheck);
                if(emailcheck!=null){
                return res.status(401).json({message:"Email Already Exists"})
                }else{
                const password=await bcrypt.hash(`${req.body.password}`,5)
                const data={
                    fname: `${req.body.fname}`, 
                    lname:`${req.body.lname}`,
                    email:`${req.body.email}`,
                    dob:`${req.body.dob}`,
                    mobile_no:`${req.body.mobile}`,
                    age:`${req.body.age}`,
                    password:password,
                    active_pin:active_pin,
                    otp:otp4Digit()
                }
                console.log(data);
                await db.sequelize.models.users.create(data);     
                const html=`<h3>Username:${req.body.email}</h3>
                          <h3>password:${req.body.password}</h3>
                          <h3>Otp For verification: ${data.otp}</h3>
                          
                          `;                     
                mailServices.sendEmail(req.body.email,'Thank for registration','Health and Wellness',html,null)

              
                const url=`/verifyuser?email=${req.body.email}`;
                res.status(200).send({
                    url
                });
                // res.redirect(`/verifyuser?email=${req.body.email}`);
                    
                }
                

            }catch(error){
                console.log(error);
                res.send(error);                
            }
        },

        async markDone(req,res){
            await db.sequelize.models.medication.update({
                markDone:1
           },{ where:{id:`${req.body.markid}`}});
           res.json('Your medicine is marked as done')


            // await db.sequelize.models.users.update('medication',)

        },

        async verifyotp(req,res){
            // req.makeSession = false;
            flag=false;
            // const makesession=false;
            // req.makesession=false;
            otpService.otpService(req,res,flag);
            
        },

        async verifyuser(req,res){
        res.render('./sections/verifyuser.ejs')

        },

        async login(req,res){
            res.render("./sections/login")
        },

        async loginUser(req,res){
            try{
                console.log(req.body);
                const user = await db.sequelize.models.users.findOne({ where: { email: `${req.body.email}` } });
                // console.log(user);
                if(user==null){
                    return res.status(401).json({message:"Wrong Credentials"})
                }
                else if(user!==null){
                    let password=await bcrypt.compare(`${req.body.password}`, user.password);
                    console.log('password---------',password);
                    if(password==false || password==null){
                        // console.log('wrong credentials');
                        return res.status(401).json({message:"Wrong Credentials"})
                    }
                    else{
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
                        }
                        await db.sequelize.models.sessions.create(session);
                        // console.log(session);
                      return  res.status(200).send({ status: 'ok' });
                    }
                }
            }catch(error){
                console.log(error);
            }
        },

        async dashboard(req,res){
            res.render("./sections/dashboard")
        },
        async medication(req,res){
         try{
            res.render("./sections/medication")
         }catch(err){
            console.log(err);
         }
        }
        
    }
}

module.exports=homeController;