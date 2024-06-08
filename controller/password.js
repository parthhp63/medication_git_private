const db = require("../database/models");
const bcrypt = require('bcrypt');


const password=()=>{
    return{
        async forgetPassword(req,res){
            res.render("./sections/forgetpass.ejs");
        },

        async checkEmail(req,res){
            console.log(req.body);
            const checkmail= await db.sequelize.models.users.findOne({where:{email:`${req.body.email}`}})
            console.log('checkmail',checkmail);
            if(checkmail==null){
                return res.status(401).send({message:"Wrong Email"})
            }else{
                return  res.status(200).send({ checkmail:checkmail });
            }
        },

        async newpage(req,res){
            res.render('./sections/password_update.ejs');
        },

        async updatePass(req,res){
            console.log(req.body);
            // const password=await bcrypt.hash(`${req.body.password}`,5)
            // const data={
            //     password:password
            // }
            // await db.sequelize.models.users.update(
            //     {data}
            // )
        }

    }
}

module.exports=password;