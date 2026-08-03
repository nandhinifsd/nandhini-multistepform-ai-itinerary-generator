let url;

/*fetch(url)
.then(response=>response.json())
.then((data)=>
{
    users=data;
})*/


 let username=document.getElementById("username");
 let matchedUser=[];
 username.addEventListener("change",checkUser);
 username.addEventListener("input", () => {
    document.getElementById("username-message").innerText = "";
});

   async function checkUser()
    {   
        let input=username.value.trim();
        if(/^\d{10}$/.test(input))
        {
             url = `https://nandhini-multistepform-ai-itinerary.onrender.com/users?phone=${encodeURIComponent(input)}`;
        }
        else{
             url = `https://nandhini-multistepform-ai-itinerary.onrender.com/users?username=${encodeURIComponent(input)}`;
        }
       console.log(url);
    const response = await fetch(url);
    const data = await response.json();
        if(data.length>0)
        {
        matchedUser=data;
        console.log(matchedUser)
         document.getElementById("username-message").innerText="User Exists"
        return matchedUser;
        }
        else
        {
        document.getElementById("username-message").innerText="User not Exists-Kindly recheck your email / phone number. If new User click signup"
        return;
        }
            
    }
    console.log(matchedUser);
    let pwd=document.getElementById("password");
    pwd.addEventListener("input", () => {
    document.getElementById("validation-message").innerText = "";
});
    let signin=document.getElementById("signin-btn");
    signin.addEventListener("click",login);
    function login()
    {
        
        document.getElementById("username-message").innerText = "";
    document.getElementById("validation-message").innerText = "";

        if (username.value=="")
        {
            document.getElementById("username-message").innerText="User name is empty";
            return;

        }
    
        if(pwd.value=="")
        {
            document.getElementById("validation-message").innerText="Enter your password";
            return;
        }
       
        if(matchedUser[0])
        {
            if(pwd.value.trim()===matchedUser[0].password.trim())
            {
                console.log("password matched")
                  window.location.href = "index.html";
                  let loggedUser = {
                                 id: matchedUser[0].id,
                                 username: matchedUser[0].username,
                                name: matchedUser[0].name
                                      };

                        localStorage.setItem("loggedUser",JSON.stringify(loggedUser));
                        localStorage.setItem("loggedin",true);
            }
            else
            {
                document.getElementById("validation-message").innerText="Password Mismatch-Try Again";
                localStorage.setItem("loggedin",false);
                loggedUser=localStorage.getItem("loggedUser");
                if(loggedUser)
                localStorage.removeItem("loggedUser");

            }
                 
        }
        }
    