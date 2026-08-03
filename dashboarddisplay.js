const plantrip=document.getElementById("plantrip-btn");
const savedtrip=document.getElementById("savedtrips-btn");
const plantripcontainer=document.querySelector(".planurtrip-container");
const tripcontainer=document.querySelector(".trips-display-container");
/*alltrips swiper initialization */
   const swiper1 = new Swiper(".swiper1", {
      effect: "cards",
      grabCursor: true,
      loop:false,
      rewind:true,
      slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
        delay: 3000
    },
    });

/**saved trips swiper initialization */
const swiper2 = new Swiper(".swiper2", {
      effect: "cards",
      grabCursor: true,
      loop:false,
      rewind:true,
      slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
        delay: 3000
    },
    });

    

plantripcontainer.style.display="none";
tripcontainer.style.display="block";
    
plantrip.addEventListener("click",function(){
    plantripcontainer.style.display="block";
    tripcontainer.style.display="none";
    loadPlanurtrip();
});
savedtrip.addEventListener("click",function(){
     plantripcontainer.style.display="none";
    tripcontainer.style.display="block";
})

const tripSidebar = document.getElementById("tripSidebar");

tripSidebar.addEventListener("shown.bs.offcanvas", () => {

    swiper1.update();
    swiper2.update();

});