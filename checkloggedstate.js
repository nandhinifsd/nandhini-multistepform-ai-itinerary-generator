const loggedin=document.getElementById("loggedinstate");
const loggedout=document.getElementById("logoutstate");
let link = document.querySelector("#loggedinstate a");

let logFlag=localStorage.getItem("loggedin");
let logUser=JSON.parse(localStorage.getItem("loggedUser"));
console.log(logUser);
if((logFlag === "true") && (logUser!==undefined))
{
    loggedout.style.display="none";
    loggedin.style.display="block";
    link.innerText=logUser.name;
    document.getElementById("logout-btn").addEventListener("click",logout);

}
else{

     loggedout.style.display="block";
    loggedin.style.display="none";
}
  function logout()
{
    loggedout.style.display="block";
    loggedin.style.display="none";
    localStorage.removeItem("loggedUser");
    localStorage.setItem("loggedin",false);
}
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.querySelector(".navbar-collapse");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if(navbarCollapse.classList.contains("show")){
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
        }
    });
});