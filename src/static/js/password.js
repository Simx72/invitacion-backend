const pw = document.getElementById('password');
const pwbtn = document.getElementById('password-btn');
if (pw != null && pwbtn != null) {
    pwbtn.innerText = "Mostrar contraseña"
    function toggle () {
        if (pw.type === "password") {
            pw.type = "text"
            pwbtn.innerText = "Ocultar contraseña"
        } else {
            pw.type = "password"
            pwbtn.innerText = "Mostrar contraseña"
        }
    }
    pwbtn.addEventListener('click', ev => {
        ev.preventDefault();
        toggle();
    }, false)
}