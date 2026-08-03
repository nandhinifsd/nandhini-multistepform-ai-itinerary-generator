
let room_count=1;


function initializeAddroom()
{
const btn=document.getElementById("addroom-btn");
const space=document.querySelector(".room-space");
btn.addEventListener("click",function(){
    createRoom(space)
});
}

function createRoom(space)
{
   
    if(room_count<4)
    {
         room_count++;
         console.log("room created:",room_count);
   let room =document.createElement("div");
   room.classList.add("col-lg-3");
   room.classList.add("col-md-4");
   room.classList.add("col-6");
   room.innerHTML=`<div class="card shadow border-0 mx-auto p-3 bg-transparent">
        <div class="card-body">
            <h2 class="subheading-font text-center text-white mb-4">Room - ${room_count}</h2>
            <div class="row g-4 d-block">
                <label class="form-label subheading-font text-white">Adults
                    </label>
                <input type="number" class="form-control text-center  adult-count" min="1" max="10"  value="1" required>
                </div>
            
            <div class="row g-4 d-block mt-2">
                    <label class="form-label subheading-font text-white"> Kids
                    </label>
                        <input type="number" class="form-control text-center kid-count" min="0"  max="10" value="0"
                               required>
                </div>
                 <div class="row g-4 mt-1 mb-1">
                    <button class="btn btn-light btn-lg text-dark px-3 w-80 rmroom-btn  mt-1 mb-1" >Remove Room
                </button>
            </div>
            </div>
                  </div>`
       let rmroom=room.querySelector(".rmroom-btn");
      rmroom.addEventListener("click",function()
      {
           room.style.display="none";
           room_count--;
           console.log("room deleted:",room_count);
        })         
        space.appendChild(room);
    }
    else
    {
        let msg=document.querySelector(".message");
        msg.innerHTML=`<h3 class="mt-3 mb-2 g-2">Maximum Room Count Reached</h3>`;
       
        setTimeout(clearmsg,3000,msg);
    }
}
function clearmsg(message)
{
 message.innerHTML="";
}
