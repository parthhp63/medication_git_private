const web=require('express').Router();
const homeController=require('../controller/homeController');
const authMiddleware=require("../middleware/authMiddleware");
const guest=require("../middleware/guest");
const medicationController=require("../controller/medicationController");
const medicationFiles = require('../middleware/multer');
const logout = require('../controller/logout');
const demo=require("../controller/demo");
const dashboard = require('../controller/dashboard');
const report = require('../controller/reportDisplay');
const password = require('../controller/password');

// const report = require('../controller/report');
web.get('/medicationone',authMiddleware,medicationController().medicationone);
web.get('/recurringmed',authMiddleware,medicationController().recurring)
web.get('/demo',demo().data);
// console.log(remainder().findmail);
web.get('/',guest,homeController().register);
web.post('/adduser',homeController().adduser);
// /verifyuser?email=${req.body.email}`
web.get('/verifyuser?:email',guest,homeController().verifyuser)
web.post('/verifyotp',homeController().verifyotp)

web.get('/forgetpassword',password().forgetPassword);
web.post('/passwordotp',password().passwordOtp);
web.post('/resetpassword',password().checkEmail);
web.get('/resetpassword?:gmail',password().forgetpassOtp);
web.get('/updatepass',password().updatePass)

web.get('/login',guest,homeController().login);
web.post('/markdone',homeController().markDone);
web.post('/login',guest,homeController().loginUser)
web.get('/dashboard',authMiddleware,dashboard().allMedicine);
web.get("/newmed",authMiddleware,dashboard().newmed);
web.get("/medication",authMiddleware,homeController().medication);
web.get("/reports",authMiddleware,report().reportDisplay);
web.post("/reports/generatereport",authMiddleware,report().generateReport);
web.get("/logout", authMiddleware,logout().logout);
web.post("/logoutall",authMiddleware,logout().logoutAll);
web.post("/logoutother",authMiddleware,logout().logoutOther);
web.post('/recurring',authMiddleware,medicationFiles.single("onetimefile"),medicationController().recurringMedication);
web.post('/onetime',authMiddleware,medicationFiles.single("onetimefile"),medicationController().onetimeMedication);
module.exports = web;