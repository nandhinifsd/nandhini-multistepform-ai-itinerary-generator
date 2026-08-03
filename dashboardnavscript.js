

const loggedin=document.getElementById("loggedinstate");
const loggedout=document.getElementById("logoutstate");
const title=document.querySelector(".title2");

let logFlag=localStorage.getItem("loggedin");
let logUser=JSON.parse(localStorage.getItem("loggedUser"));
console.log(logUser);

if((logFlag === "true") && (logUser!==undefined))
{
    loggedout.style.display="none";
    loggedin.style.display="block";
    title.innerText=" "+logUser.name;
    document.getElementById("logout-btn").addEventListener("click",logout);

}
if(logFlag==="false")
{
     loggedout.style.display="block";
    loggedin.style.display="none";
    title.innerText="";
}
function logout()
{
    loggedout.style.display="block";
    loggedin.style.display="none";
    localStorage.removeItem("loggedUser");
    localStorage.setItem("loggedin",false);
    title.innerHTML="";
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