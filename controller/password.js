const otpService = require("../services/otpService");

const db = require("../database/models");
const bcrypt = require('bcrypt');
// const otpGenerator = require('otp-generator');
const mailServices=require("../services/mailServices");
const otp4Digit = require("../helpers/otpGenerate");



const password = () => {
    return {
        async forgetPassword(req, res) {
            res.render("./sections/forgetpass.ejs");
        },

        async checkEmail(req, res) {
            console.log(req.body);
            const checkmail = await db.sequelize.models.users.findOne({ where: { email: `${req.body.email}` } })
            console.log('checkmail', checkmail);
            if (checkmail == null) {
                return res.status(401).send({ message: "Wrong Email" })
            } else {
                const otp = otp4Digit();
                await db.sequelize.models.users.update({
                    otp:otp
               },{ where:{email:`${req.body.email}`}});
            
               const html=`<h3>your Otp For verification for forget password is: ${otp}</h3>`;
               mailServices.sendEmail(req.body.email,'Otp for verification',html,null)
                return res.status(200).send({ checkmail: checkmail });

            }
        },

        async passwordOtp(req,res){
            try{
                   // req.makeSession = true;
            flag=true;
 
             otpService.otpService(req,res,flag );
            // console.log(otpService,"*******");

            }catch(error){
                console.log(error);

            }
         
        },

        async forgetpassOtp(req, res) {
            res.render('./sections/password_otp.ejs');

        },


        async  updatePass(req, res) {
            console.log(req.body);
            const token=req.cookies.token;
            // const user=
            console.log('token********',token);
            res.render("./sections/password_update");
            const password=await bcrypt.hash(`${req.body.password}`,5)
            const data={
                password:password
            }
            await db.sequelize.models.users.update(
                {data},{where:{id:req.user}}
            )
            res.render('./sections/login')
        },

    }
}

module.exports = password;