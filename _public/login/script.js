const button = document.getElementById("submit")
const check = document.getElementById("agreement")
const warning = document.getElementById("warning")
button.onclick = () => {
    if(check.checked){
        window.location.href = "/ttauth"
    }else[
        warning.innerText = "Please read and agree to our ToS and PP"
    ]
}