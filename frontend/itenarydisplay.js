 alltrips= document.querySelector(".alltripswiper");
   savedtrips=document.querySelector(".savedtripswiper");
   let user_details=JSON.parse(localStorage.getItem("loggedUser"));
   console.log(user_details);
   loadUserTrips(user_details.id);

   const swiper3 = new Swiper(".swiper3", {
      effect: "cube",
      grabCursor: true,
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      navigation: {
         nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
        },
      });
  
const selectedTripId = localStorage.getItem("selectedTripId");
console.log(selectedTripId);
if(selectedTripId){
    displaySelectedTrip(selectedTripId);
}

async function displaySelectedTrip(tripId)
{
    try {
        const response = await fetch(
            `http://localhost:3000/trips/${tripId}`
        );
        const selectedTrip = await response.json();
        console.log("Selected Trip:", selectedTrip);
        // send only the AI generated trip data
        outputframe(selectedTrip.tripData);
    }
    catch(error){
        console.log(error);
    }
}
 async function loadUserTrips(userId)
 {
    console.log(typeof userId);
    const response = await fetch(`http://localhost:3000/trips`);
    console.log(response);
    const trips = await response.json();
    console.log(trips);
    const myTrips = trips.filter(trip => trip.userId===userId);
    console.log(myTrips);
    const savedTrips = myTrips.filter(trip => trip.saved === true);
    console.log(savedTrips);
    createTripCard(savedTrips,savedtrips,swiper2);
    createTripCard(myTrips,alltrips,swiper1);
}
function createTripCard(Trips,trips,swiper_var)
{
    trips.innerHTML="";
    console.log(Trips);
    Trips.forEach(element => {
       /* trips.innerHTML+=`<div class="swiper-slide swiper-page">
            <div class="card tripinfocard" data-trip-id="element.id">
                <div class="card-body">
                    <h5 class="heading-font">${element.tripData.destination}</h5>
                    <h6 class="subheading-font">${element.tripData.duration}</h6>
                    <h6 class="subheding-font">Travellers: ${element.tripData.totalTravellers}</h6>
                    
                </div>
            </div>
        </div>`;*/
         // swiper slide
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide","swiper-page");
      
        // card
        const card = document.createElement("div");
        card.classList.add("card","tripinfocard");
     
        // store trip id
        card.dataset.tripId = element.id;
        // card body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        
        const title = document.createElement("h5");
        title.classList.add("card-title","heading-font");
        // title
        title.innerText = element.tripData.destination;
        // duration
        const duration = document.createElement("p");
        duration.classList.add("subheading-font");
        duration.innerText = element.tripData.duration;
        // button
        const viewBtn = document.createElement("button");
        viewBtn.className = "btn btn-dark subheading-font";
        viewBtn.innerText = "View Trip";
        // click event directly here
        viewBtn.addEventListener("click", function(){

              outputframe(element.tripData);

        });
        const wishlistIcon = document.createElement("i");
        wishlistIcon.classList.add("bi");
        if(element.saved){
                 wishlistIcon.classList.add("bi-heart-fill");
                wishlistIcon.style.color = "red";
        }
        else{
                 wishlistIcon.classList.add("bi-heart");
                wishlistIcon.style.color = "gray";
            }
            wishlistIcon.style.cursor = "pointer";
            wishlistIcon.style.fontSize = "25px";
        wishlistIcon.addEventListener("click", function(){
                toggleWishlist(element.id, element.saved);
        });
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add( "bi", "bi-trash");
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.fontSize = "25px";
        deleteIcon.style.color = "gray";
        deleteIcon.addEventListener("click", function(){
        deleteTrip(element.id);
});
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("d-flex","justify-content-end","gap-1","mt-3");
    iconContainer.append( wishlistIcon, deleteIcon);
    //append everything
    cardBody.append(title,duration,viewBtn,iconContainer);
        card.append(cardBody);
        slide.append(card);
        trips.append(slide);
    });  
    swiper_var.update();
swiper_var.updateSlides();
swiper_var.updateProgress();
swiper_var.updateSize();      
}

async function toggleWishlist(tripId, currentStatus)
{
    await fetch(`http://localhost:3000/trips/${tripId}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            saved: !currentStatus
        })
    });

    loadUserTrips(user_details.id);
}
async function deleteTrip(tripId)
{
    const confirmDelete = confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;
    try {
        const response = await fetch(
            `http://localhost:3000/trips/${tripId}`,
            {
                method: "DELETE"
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete trip");
        }
        // Reload the trip cards
        await loadUserTrips(user_details.id);
        alert("Trip deleted successfully!");
    } catch (error) {
        console.error(error);
        alert("Unable to delete the trip.");
    }
}
async function outputframe(trip)
{
     console.log("loading Groq Api");
  
    let output="";
    const prompt=`You are an expert travel itinerary presentation designer.

Your task is to convert the given travel itinerary JSON into a user-friendly travel dashboard format.

IMPORTANT RULES:
1. Analyze the JSON structure dynamically. Do not assume fixed keys because different destinations may have different fields.
2. Extract the most important information available from the JSON.
3. Do not remove important travel details.
4. Do not invent information that is not present in the JSON.
5. Return exactly 4-5 sections only.
6.If the content is less, increase the sections. If the content is less, reduce the sections and remove the extra cards.
6. Each section should be suitable to display inside a Bootstrap card.
7. Keep the content concise, readable, and visually appealing.
8. Do not return JSON.
9. Do not use markdown tables.
10. Use plain text with clear section headings.
11. Display only two days of itinerary per card for better readability.
12. Separate each card section using the delimiter: ===CARD===

Create these four cards:

CARD 1: TRIP OVERVIEW
Include:
- Destination
- Duration
- Traveller details
- Trip style
- Important highlights

 TRAVEL AND ACCOMMODATION
Include:
- Transportation details
- Recommended travel option
- Travel time
- Estimated travel cost
- Accommodation details
- Stay cost

CARD 2: DAY-WISE ITINERARY for Day 1 to day 2
Include:
- Daily activities
- Morning plans
- Afternoon plans
- Evening plans
- Important places to visit

CARD 3: DAY-WISE ITINERARY for day 3 to day 4
Include:
- Daily activities
- Morning plans
- Afternoon plans
- Evening plans
- Important places to visit

CARD 4: DAY-WISE ITINERARY for day 5 to day 6
Include:
- Daily activities
- Morning plans
- Afternoon plans
- Evening plans
- Important places to visit
-If the itinerary is less than 5 days, display must-not-miss places in this section 
-If the itinerary is less than 5 days, display packing suggestions in this section 
-If no content to display, remove the card and do not display it.


CARD 5: BUDGET AND TRAVEL TIPS
Include:
- Total estimated budget
- Budget breakdown if available
- Money saving tips
- Packing suggestions
- Must-not-miss places
-If Packing suggestions are not available, remove the card and do not display it.
-If Must-not-miss places are not available, remove the card and do not display it.
-If packing suggestions and must-not-miss places displayed in previous card, dont duplicate it again here
-If no content to display, remove the card and do not display it.
-Avoid providing notes about how you display the content in cards. Just display only the trip information in cards.

Formatting example:

CARD 1: TRIP OVERVIEW

Destination:
Duration:
Travellers:
Trip Style:

TRAVEL AND ACCOMMODATION

Transportation:
Accommodation:

===CARD===

CARD 2: DAY-WISE ITINERARY

Day 1:
Day 2:

===CARD===

CARD 3: BUDGET AND TRAVEL TIPS

Budget:
Tips:

Now convert this itinerary JSON:

${JSON.stringify(trip)}`
try{
            // API CALL
            const response = await fetch("https://nandhini-multistepform-ai-itinerary.onrender.com/format-trip",
{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        prompt: prompt
    })});
             
    
              if (!response.ok) {
                 const errorData = await response.text();
                console.log("Groq Error Response:", errorData);
                  throw new Error(`HTTP ${response.status}`);
}
              const data = await response.json();

            // data.candidates.[0].content.parts.[0].text

             output = data?.choices?.[0]?.message?.content;
            console.log(data);
            console.log(output); 
            showTripDetails(output,swiper3);
            } 
    
            catch(err){
            console.log(err);
             }
}

function showTripDetails(output,swiper_var)
{
      const container = document.querySelector(".showtripswiper");
    container.innerHTML = "";
    output.split("===CARD===").forEach((cardContent, index) => 
        {
        const swiper = document.createElement("div");
        swiper.classList.add("swiper-slide");
        swiper.classList.add("swiper-page");
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("show-card");
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        const contentLines = cardContent.trim().split("\n").filter(line => line.trim() !== "");
            const h1 = document.createElement("h1");
            h1.textContent = contentLines[0].trim();
            h1.classList.add("heading-font");
            cardBody.appendChild(h1);
            for (let i = 1; i < contentLines.length; i++)
                 {
                const line = contentLines[i].trim();
                console.log(line);
                if (line.includes(":")) 
                    {
                    const [key, value] = line.split(/:(.+)/);   
                    const p = document.createElement("p");
                    if((value==="")||(value===undefined))
                        p.innerHTML = `<strong>${key.trim()}</strong>`;
                    
                    else
                    p.innerHTML = `<strong>${key.trim()}:</strong> ${value.trim()}`;
                p.classList.add("subheading-font");
                    cardBody.appendChild(p);
                }
                else{
                    const p = document.createElement("p");
                    p.textContent = line;
                    p.classList.add("subheading-font");
                    cardBody.appendChild(p);
                }
            }
            swiper.appendChild(card);
        card.appendChild(cardBody);
        container.appendChild(swiper);
    })
    swiper_var.update();
swiper_var.updateSlides();
swiper_var.updateProgress();
swiper_var.updateSize();
}