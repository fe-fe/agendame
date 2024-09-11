user = document.getElementById("user");
pw = document.getElementById("pass");
fm = document.getElementById("form");

window.addEventListener("load", function() {
    erro = document.getElementById("error");
    msg = erro.innerText;
    if (msg.length > 0) {
        this.alert(msg);
    }
});


fm.addEventListener("submit", function(event) {
    let invalid = false;

    if (user.value.trim() === "") {
        user.classList.add("ierr");
        invalid = true;
    }

    if (pw.value.trim() === "") {
        pw.classList.add("ierr");
        invalid = true;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/; // Somente letras, números, _ e -
    if (!usernameRegex.test(user.value.trim())) {
        user.classList.add("ierr");
        window.alert("O nome de usuário só pode conter letras, números, _, e -");
        invalid = true;
    } else if (user.value.trim().length < 4) {
        user.classList.add("ierr");
        invalid = true;
        window.alert("O usuario precisa ter pelo menos 4 caracteres")
    } 


    

    
    if (invalid) {
        event.preventDefault();
    }
});


user.onclick = function() {
    user.classList.remove("ierr")
}

pw.onclick = function() {
    pw.classList.remove("ierr")
}