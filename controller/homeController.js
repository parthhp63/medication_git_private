const db=require("../database/models/index");
const jwt=require('jsonwebtoken')
const mailServices=require("../services/mailServices");
const UserAgent = require('user-agents');  
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");
const otpGenerator = require('otp-generator')

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
                    // console.log(req.body);
                const otp=otpGenerator.generate(4, { lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
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
                    otp:otp
                }
                console.log(data);
                await db.sequelize.models.users.create(data);     
                const html=`<h3>Username:${req.body.email}</h3>
                          <h3>password:${req.body.password}</h3>
                          <h3>Otp For verification: ${otp}</h3>`;                     
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

        async verifyotp(req,res){
            console.log(req.body);
            const otp=await db.sequelize.models.users.findOne({ where: { email: `${req.body.email}` } })
            if(otp==null){
                return res.status(401).json({message:"Wrong OTP"})

            }
            else{
                const a=(`${req.body.otp1}`+`${req.body.otp2}`+`${req.body.otp3}`+`${req.body.otp4}`)
               if(a==otp.otp){
                const query=await db.sequelize.models.users.update({ isActivated:1 },
                    {
                        where: {
                            email:`${req.body.email}`
                            },
                            },)
                        return  res.status(200).send({ status: 'ok' });

               }else{
                return res.status(401).json({message:"Wrong OTP"})
               }
            }
        },

        async verifyuser(req,res){
        res.render('./sections/verifyuser.ejs')

        },

        async login(req,res){
            res.render("./sections/login")
        },

        async loginUser(req,res){
            try{
                const user = await db.sequelize.models.users.findOne({ where: { email: `${req.body.email}` } });
                // console.log(user);
                if(user==null){
                    return res.status(401).json({message:"Wrong Credentials"})
                }
                else if(user!==null){
                    let password=await bcrypt.compare(`${req.body.password}`, user.password);
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
                            session:token
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