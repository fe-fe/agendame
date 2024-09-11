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