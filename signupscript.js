let f_name=document.getElementById("fullname");
let email=document.getElementById("email");
let ph=document.getElementById("phonenum");
let pwd=document.getElementById("newpassword");
let conf_pwd=document.getElementById("confrimpassword");
let check=document.getElementById("terms");

let name_err=document.getElementById("fullname-errmsg");
let mail_err=document.getElementById("email-errmsg");
let ph_err=document.getElementById("phonenum-errmsg");
let pwd_err=document.getElementById("pwdvalidation-msg");
let cnfpwd_err=document.getElementById("cnfpwdvalidation-msg");
let terms_err=document.getElementById("checkterms-msg");

const signup=document.getElementById("signup-btn");
const reset=document.getElementById("reset-btn");

 const nameRegex = /^[A-Za-z ]{4,20}$/;
 const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
let emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[6-9]\d{9}$/;
let name,username,password,phone;
const url="https://nandhini-multistepform-ai-itinerary.onrender.com/users";

f_name.addEventListener("input",validateFullname);
function validateFullname ()
{
    name_err.innerHTML="";
    if((f_name.value.trim()==="")||(f_name.value.trim()===null))
    {
        name_err.innerHTML="Full name field cannot be empty";
        return false;
    }
        
   else if(f_name.value.trim().length<4)
    {
         name_err.innerHTML="Full name must be atleast 4 characters";
         return false;
    }   
   else if(!nameRegex.test(f_name.value.trim()))
    {
        name_err.innerHTML="Full name can have 20 character max. and must have only alphabets";
        return false;
    }
    else
     {
        name=f_name.value.trim();
        return true;
    }
        
}

email.addEventListener("input",validateEmail)
function validateEmail(){
    mail_err.innerHTML="";
    if((email.value.trim()==="")||(email.value.trim()===null))
    { mail_err.innerHTML="Email cannot be empty";
        return false;
    }
       
    else if(!emailregex.test(email.value.trim()))
    {
        mail_err.innerHTML="Email format is not valid";
        return false;
    }
        
    else
    {
         username=email.value.trim();
         let email_check=checkDuplicateEmail(username);
         if(email_check)
        return true;
    }
       
}

ph.addEventListener("input", validatePhone);
 function validatePhone()
 {
    ph_err.innerHTML="";
    if((ph.value.trim()==="")||(ph.value.trim()===null))
    {
         ph_err.innerHTML="Phone Number cannot be empty";
         return false;
    }
       
    else if((ph.value.trim().length<10) || (ph.value.trim().length>10))
    {
        ph_err.innerHTML="Phone Number must have 10 digits";
        return false;
    }
        
    else if(!phoneRegex.test(ph.value.trim()))
    {
        ph_err.innerHTML="Enter a valid phone number";
        return false;
    }
        
    else
    {
         phone=ph.value.trim();
         let phone_check=checkduplicatePhone(phone)
         if(phone_check)
         return true;
    }
       
}

pwd.addEventListener("input",validatePwd);
function validatePwd()
{
    pwd_err.innerHTML="";
    if((pwd.value.trim()==="")||(pwd.value.trim()===null))
    {
        pwd_err.innerHTML="Password cannot be empty";
        return false;
    }
     else if((pwd.value.trim().length<8) || (pwd.value.trim().length>20))
     {
        pwd_err.innerHTML="Password must have min. of 8 and max. of 20 Characters"
        return false;
     }

    else if(!passwordRegex.test(pwd.value.trim()))
    {
        pwd_err.innerHTML="Enter a valid password with atleast one lower case, one upper case, one digit and one special character";
        return false;
    }
    else
    {
       
        return true;
    }
        
}
conf_pwd.addEventListener("input",validateConfPwd);
function validateConfPwd()
{
    cnfpwd_err.innerText="";
    if(pwd.value.trim()!==conf_pwd.value.trim())
    {
        cnfpwd_err.innerHTML="Passwords dont match"
        return false;
    }
    else
    {
        password=conf_pwd.value.trim();
        return true;
    }
}
reset.addEventListener("click",Reset);
function Reset()
{
f_name.value="";
email.value="";
ph.value="";
pwd.value="";
conf_pwd.value="";
name_err.innerText="";
mail_err.innerText="";
ph_err.innerText="";
pwd_err.innerText="";
cnfpwd_err.innerText="";
check.checked=false;
terms_err.innerText="";
}
signup.addEventListener("click",function(e){
    e.preventDefault();
    Signup();
});
async function Signup()
{

if(check.checked===false)
{
    terms_err.innerHTML="Agree Terms and Conditions"
    return;
}
let name_success=validateFullname();
let email_success=validateEmail();
let ph_success=validatePhone();
let pwd_success=validatePwd();
let confpwd_success=validateConfPwd();

if(name_success && email_success && ph_success && pwd_success && confpwd_success && check.checked)
{
   
    let newuser={name,username,password,phone};
     const response= await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(newuser)
    });
    console.log(response.status);

    const text = await response.text();
    console.log(text);
    
    window.location.href="signin.html";
}
else
    console.log("Sign up failed")

}
async function checkDuplicateEmail(emailid)
{
    const emailResponse = await fetch(
    `https://nandhini-multistepform-ai-itinerary.onrender.com/users?username=${encodeURIComponent(emailid)}`
);

const emailData = await emailResponse.json();

if (emailData.length > 0) {
    mail_err.innerText = "Email already exists";
    return false;
}
else
    return true;
}
async function checkduplicatePhone(phoneno)
{
    const phoneResponse = await fetch(
    `https://nandhini-multistepform-ai-itinerary.onrender.com/users?phone=${encodeURIComponent(phoneno)}`
);

const phoneData = await phoneResponse.json();

if (phoneData.length > 0) {
    ph_err.innerText = "Phone number already registered";
    return false;
}
else
    return true;
}