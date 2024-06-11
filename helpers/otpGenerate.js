const otpGenerator = require('otp-generator');
const otp4Digit=()=>{
    return otpGenerator.generate(4, { lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
    
}
module.exports=otp4Digit;