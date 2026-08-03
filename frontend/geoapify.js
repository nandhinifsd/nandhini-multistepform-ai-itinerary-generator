
let latitude=0,longitude=0;
let places=[];
function initializeGeoapify()
{

let search=document.getElementById("destinationsearch");
let list=document.getElementById("datalistOptions");
search.addEventListener("input",function(){
    suggestions(search,list)
});
}

 function suggestions(city,list)
{
    let url=`https://nandhini-multistepform-ai-itinerary.onrender.com/api/location-search?text=${city.value}`
    if(city.value.length>2)
    {
        fetch(url)
    .then(response=>response.json())
    .then(data=>{console.log(data)
    console.log(data.features.length)
    places=data.features;
    list.innerHTML="";
    for(let i=0;i<data.features.length;i++)
    {   
        console.log(data.features[i].properties.formatted)
        console.log(data.features[i].properties.city)
       
        let option=document.createElement("li");
        let place = data.features[i].properties;
        console.log("I executed here")
        let location = place.city || place.town || place.village || place.state ||  place.name;
        let loc=location+", "+place.country;
        console.log(loc);
        option.innerText=loc;
        list.style.display="flex";
        option.addEventListener("click",function(){
            list.style.display="none";
            city.value=option.innerText;
          //  calcCoordinates(loc);
        })
        list.appendChild(option);
         console.log("I executed here2")
    }
    
})
    .catch(err=>console.log(err))
    }}


 function calcCoordinates(location)
 {
console.log("here I am");

console.log(places);
   
    for(let i=0;i<places.length;i++)
    {
        let name= places[i].properties.city || places[i].properties.town || places[i].properties.village || places[i].properties.state ||  places[i].properties.name;
        let city=name+", "+places[i].properties.country;
        console.log(city);
        if (city==location)
        {
            let selectedPlace=places[i];
        longitude = selectedPlace.geometry.coordinates[0];
        latitude = selectedPlace.geometry.coordinates[1];
        console.log(latitude, longitude);
        }
    }
   
    

}




