




async function loadGroqApi(destination,trip_type,trip_vibe,room_details,departure_date,departure_city,arrival_date,arrival_city,pref)
{
    console.log("loading Groq Api");
  
    let output="";
    
const prompt=`You are an expert AI Travel Planner and Budget Consultant. Create a personalized, practical, and realistic travel itinerary based on the user's trip details. 
USER INPUT: 
Destination: "${destination}"
Travellers Type: "${trip_type}"
Trip Style: "${trip_vibe}"
Rooms:"${JSON.stringify(room_details)}"
Departure Date: "${departure_date}"
Arrival Date: "${arrival_date}"
Departure City: "${departure_city}"
Return City: "${arrival_city}"
Additional Preferences:
"${pref}"
INSTRUCTIONS: 
1. Calculate the total number of trip days and nights using the arrival and departure dates. 
2. Mention the duration clearly at the beginning (Example: "6 Days and 5 Nights"). 
3. Determine the total number of travellers using the room details. 
4. Consider the traveller type while planning: 
- Family: include family-friendly activities and suitable timings. 
- Couple: include romantic experiences and private activities. 
- Solo Trip: include safe, efficient, and immersive experiences. 
- Friends: include group activities, nightlife, adventure, and social experiences. 
5. Modify the itinerary according to the trip style: 
- Kid Friendly: include kid friendly attractions, provide enough time for each attractions, kid friendly restaurant options, what to avoid, what things to follow 
- Attractions Oriented: try to cover all the important and famous places of the destination within the itinerary. 
- Leisure -include resort kind of stays and leisure activities that can be explored in the destination 
- Nature - include all the spots in the destination to explore nature and include natural activites
- Romance -include romantic experiences and private activities which help couple to improve bond between them
-Adventure -include the adventure activites that can be explored in that area, risks included and safe age and health requirements to try the activity
6. Carefully consider all additional preferences provided by the user and incorporate them wherever possible. 
TRANSPORTATION ANALYSIS: 
7. Find all practical transport options from the departure city to the destination and from the destination back to the return city. 
8. Include: 
- Flight 
- Train 
- Bus 
- Self-drive/Taxi (if practical) 
9. For each transport option provide: 
- Estimated travel time 
- Approximate budget per person 
- Approximate total budget for the entire group 
- Comfort level 
- Recommendation (Budget / Fastest / Most Comfortable / Family Friendly) 
ACCOMMODATION: 
10. Recommend suitable accommodation categories based on traveller type and trip style: 
- Budget 
- Mid-range 
- Premium 
11. Estimate accommodation costs based on: 
- Number of rooms 
- Adults and children 
- Number of nights 
DAILY ITINERARY: 
12. Create a day-by-day itinerary. 
13. For every day include: 
- Morning 
- Afternoon 
- Evening 
- Suggested meals or local cuisine 
- Estimated cost for the day's attractions 
14. Keep the schedule realistic and avoid excessive travel in a single day. 
15. Include rest time for families, leisure travellers, and longer trips. 
BUDGET ESTIMATION: 
16. Provide a complete estimated budget breakdown: 
- Transportation 
- Accommodation 
- Food 
- Attractions 
- Local transport 
- Shopping (optional) 
- Miscellaneous expenses 
17. Provide budget ranges in the following categories: 
- Budget Trip 
- Mid-range Trip 
- Luxury Trip 
18. Show both: 
- Cost per person 
- Total trip cost for the entire group 
FINAL SUMMARY: 
19. At the end provide: 
- Recommended transport option 
- Recommended budget category 
- Total estimated budget range 
- Money-saving tips 
- Best experiences not to miss 
- Essential packing suggestions based on the destination and season 
OUTPUT FORMAT: 
# Trip Overview 
Destination: 
Duration: 
Traveller Type: 
Trip Style: 
Total Travellers: 
# Transportation Options 
# Recommended Transportation 
# Accommodation Estimate 
# Day Wise Itinerary 
# Budget Breakdown 
# Total Estimated Budget 
# Money Saving Tips 
# Must Not Miss Experiences 
# Packing Suggestions 
Ensure all budgets are realistic, current, and appropriate for the destination, season, number of travellers, and trip duration. Never assume a single traveller unless room details indicate so. Provide the result formats into a json which can be saved in database and retrived on user's request.
OUTPUT REQUIREMENTS:
Return ONLY valid JSON.
OUTPUT REQUIREMENTS:
Return ONLY valid JSON.
Do NOT wrap the response in Markdown.
Do NOT include \`\`\`json or \`\`\`.
Do NOT include explanations.
The response must start with { and end with }.
\`
Use exactly below structure:
{
  "destination": "",
  "duration": "",
  "travellerType": "",
  "tripStyle": "",
  "totalTravellers": 0,
  "transportation": {
    "recommended": "",
    "options": []
  },
  "accommodation": {},
  "dayWiseItinerary": [],
  "budget": {},
  "moneySavingTips": [],
  "packingSuggestions": [],
  "mustNotMiss": []
}`;
console.log(prompt);
 try{
            // API CALL
            const response = await fetchGroqWithRetry( "https://nandhini-multistepform-ai-itinerary.onrender.com/generate-trip",
             {
              method: "POST",
              headers: {
                        "Content-Type": "application/json"
                        },
             body: JSON.stringify({
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
         
            if(output!=="")
             Updatedata(JSON.parse(output));
            
            } 
    
            catch(err){
            console.log(err);
             }
             
}

async function fetchGroqWithRetry(url, options) {

    for (let attempt = 1; attempt <= 3; attempt++) 
      {

        const response = await fetch(url, options);

        if (response.ok) {
            return response;
            
        }

        if (response.status === 503) {
            console.log(`Groq busy. Retrying ${attempt}/${3}`);

            await new Promise(resolve => 
                setTimeout(resolve, attempt * 3000)
            );

            continue;
        }

        throw new Error(`Groq Error: ${response.status}`);
    }

    throw new Error("Groq unavailable after retries");
}

async function Updatedata(output)
 {
   const url=`https://nandhini-multistepform-ai-itinerary.onrender.com/trips`;
   let user_details=JSON.parse(localStorage.getItem("loggedUser"));
   console.log(user_details);
   const new_trip = {
        userId: user_details.id,
        saved: false,
        createdAt: new Date().toISOString(),
        tripData: output
    };
    console.log(new_trip);
    const response=await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(new_trip)
});
    console.log(response.status);
    
    const savedTrip = await response.json();
    console.log(savedTrip);
     localStorage.setItem("selectedTripId", savedTrip.id);
     window.location.href = "tripdashboard.html";
    
 }