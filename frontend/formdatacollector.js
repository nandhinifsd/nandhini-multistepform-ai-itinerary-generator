
let destination="";
let trip_type;
let room_details=[];
let trip_vibe;
let departuredate,arrivaldate,departurecity,arrivalcity;

function initializeformDatacollector()
{
    const carousel=new bootstrap.Carousel(document.getElementById("tripstepcarousel"));
const form=document.getElementById("wholetripform");
const spot=document.getElementById("destinationsearch");
console.log(spot);
const triptypebtn=document.querySelectorAll(".triptype-btn");

for (let btn of triptypebtn)
{   
    console.log(btn);
   
    btn.addEventListener("click",function(){
        triptypebtn.forEach((button)=>{
             button.classList.remove("active")
        });
            trip_type=this.value;
            this.classList.add("active");
            console.log(trip_type);
    });
}
document.getElementById("step1next").addEventListener("click",function(){
    if(spot.value==="")
    {
        console.log(spot.value);
        alert("Enter Your Destination")
    }
    else if(trip_type===undefined)
    {
        console.log(trip_type);
        alert("Select your Trip Type")
    }
    else{
        destination=spot.value;
        console.log(trip_type);
        carousel.next();
    }
});

const tripvibebtn=document.querySelectorAll(".trip-vibe");
console.log(tripvibebtn);
for (let btn of tripvibebtn)
{   
    console.log(tripvibebtn);
    btn.addEventListener("click",function(){
         tripvibebtn.forEach((button)=>{
             button.classList.remove("active")
        });
            trip_vibe=this.value;
             this.classList.add("active");
            console.log(trip_vibe);
    });
   
}
 document.getElementById("step2next").addEventListener("click",function()
 {
     if(trip_vibe===undefined)
     {
         alert("Select your Trip Vibe");
     }
     else{
         console.log(trip_vibe);
        carousel.next();
     }
 });
 document.getElementById("step3next").addEventListener("click",function()
{
   let rooms=room_count;
   let adult_count=document.querySelectorAll(".adult-count");
    let kid_count=document.querySelectorAll(".kid-count")
    console.log(rooms,adult_count,kid_count);
    
    for(let i=0;i<rooms;i++)
    {
        room_details[i]={};
        room_details[i].room_number=i+1;
        if(adult_count[i].value!=="0")
        {
             room_details[i].adults=parseInt(adult_count[i].value);
        }
       else
        {
         alert("Kindly Enter Proper Adults Count")
       }
        room_details[i].kids=parseInt(kid_count[i].value);
    }
    console.log(room_details);  
    carousel.next();
    
    });
    let dep_date=document.getElementById("departuredate");
    let arr_date=document.getElementById("arrivaldate");
    let dep_city=document.getElementById("departurecity");
    let arr_city=document.getElementById("arrivalcity");
    
   let list=document.querySelectorAll(".citylist");
    dep_city.addEventListener("input",function(){
        suggestions(dep_city,list[0]);
    });
      arr_city.addEventListener("input",function(){
        suggestions(arr_city,list[1]);
    })
    
    


   

    document.getElementById("step4next").addEventListener("click",function()
    {
        if(dep_date.value==="")
        {
            alert("Enter Departure Date")
        }
        else
        {
            departuredate=dep_date.value;
        }
         if(arr_date.value==="")
        {
            alert("Enter Arrival Date")
        }
        else
        {
            arrivaldate=arr_date.value;
        }
          if(dep_city.value==="")
        {
            alert("Enter Departure City")
        }
        else
        {
            departurecity=dep_city.value;
        }
          if(arr_city.value==="")
        {
            alert("Enter Departure City")
        }
        else
        {
            arrivalcity=arr_city.value;
        }
        console.log(arrivaldate,departuredate,departurecity,arrivalcity);
        if((arrivaldate!=="") && (departuredate!=="") && (arrivalcity!=="") && (departurecity!==""))
        {
            carousel.next();
        }

    });
    let email=document.getElementById("emailid");
    let phone1=document.getElementById("phoneno");
    let phone2=document.getElementById("alterphoneno");
    let preference=document.getElementById("message");
    
    let emailid,ph1,ph2,pref;

    form.addEventListener("submit",function(e){
        e.preventDefault();
        let result=step5validation();
        
        if(destination && trip_type && trip_vibe && room_details && departuredate && departurecity && arrivaldate && arrivalcity && result)
        {
             pref=preference.value;
           let loggedin_status=localStorage.getItem("loggedin");
           let user_details=JSON.parse(localStorage.getItem("loggedUser"));
           if ((loggedin_status==="true")&&(user_details!==undefined))
           {   
            loadGroqApi(destination,trip_type,trip_vibe,room_details,departuredate,departurecity,arrivaldate,arrivalcity,pref);
          
         

        }
            else
            {
                alert("login to proceed");
                window.location.href="signin.html";
                return;
            }
                

        }

    });
      
    
function step5validation()
{
function validatePhone(phone)
 {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
if (!validatePhone(phone1.value)) {
    alert("Please enter a valid mobile number.");
    return false;
}
else 
{
    ph1=phone1.value;
}
if (!validatePhone(phone2.value)) {
    alert("Please enter a valid Alternate mobile number.");
    return false;
}
else{
    ph2=phone2.value;
}

if (!validateEmail(email.value)) {
    alert("Please enter a valid email address.");
    return false;
}
else{
    emailid=email.value;
}

 if (ph1 === ph2) {
        alert("Primary and alternate phone numbers cannot be the same.");
        return false;
    }
    return true;
}
}
