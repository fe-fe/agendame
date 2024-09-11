const add = document.getElementById("add");
const rem = document.getElementById("rem");
const btnAdd = document.getElementById("addbt");
const btnRem = document.getElementById("rembt");
const closeBtnAdd = document.getElementById("closeadd");
const closeBtnRem = document.getElementById("closerem");
const form = document.getElementById("formAdicionarMateria");
const rselect = document.getElementById("rselect");
const mbt = document.querySelectorAll(".matb");

window.addEventListener("load", function() {
    if (mbt.length == 8) {
        btnAdd.classList.add("hide");
    }

    fixFreq();

});

// Mostra o popup quando o botão "Adicionar" for clicado
btnAdd.onclick = function() {

    if (mbt.length >= 8) {
        alert("Voce so pode ter 8 materias simultaneamente.")
    } else {
        add.style.display = "flex";
    }

    
}


function fixFreq() {

    document.querySelectorAll(".freqbar").forEach(freqbar => {
        const freqnum = freqbar.querySelector(".freq");
        const freq = parseFloat(freqnum.innerHTML);

        const bar1 = freqbar.querySelector(".bar1");
        const bar2 = freqbar.querySelector(".bar2");

        if (freq == 100) {
            bar2.style.display = "none";
            bar1.style.borderRadius = "10px";
            bar1.style.width = "100%";
        } else {
            bar1.style.width = freq+"%";
            bar2.style.width = 100-freq+"%";
        }
    
        freqnum.innerHTML = freq + "%";

        setTimeout(() => {
            freqbar.style.display = "flex";
            freqbar.classList.remove("hide");
        }, 0);  // Delay for one event loop cycle

    })

}


btnRem.onclick = function() {
    rem.style.display = "flex";
}

// Fecha o popup quando o usuário clicar no 'x'
closeBtnAdd.onclick = function() {
    add.style.display = "none";
}

closeBtnRem.onclick = function() {
    rem.style.display = "none";
}


// Fecha o popup quando o usuário clicar fora da caixa de conteúdo
window.onclick = function(event) {
    if (event.target == add || event.target == rem) {
        add.style.display = "none";
        rem.style.display = "none";
    }
}

// Manipulação do envio do formulário
async function addsubmit() {

    if (mbt.length === 8) {
        return
    } else if (add.style.display == "flex") {
        const nome = document.getElementById("nomeMateria").value;
        const url = document.getElementById("submitadd").getAttribute("data-url");
        
        // Criando um FormData para enviar via POST
        const formData = new FormData();
        formData.append('nomeMateria', nome);
        formData.append('action', "ADD");
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // CSRF token necessário para Django
            },
            body: formData // Enviando dados como formulário
        });

        if (response.ok) {
            add.style.display = "none"; // Fecha o modal após salvar
        } else {
            console.error('Erro ao adicionar a matéria');
        }
    }
}

// Manipulação do envio do formulário
async function remsubmit() {
    
    const url = document.getElementById("submitrem").getAttribute("data-url");
    var options = rselect.options;
    var matid = options[options.selectedIndex].id;
    
    // Criando um FormData para enviar via POST
    const formData = new FormData();
    formData.append('matid', matid);
    formData.append('action', "REM");
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // CSRF token necessário para Django
        },
        body: formData // Enviando dados como formulário
    });

    if (response.ok) {
        add.style.display = "none"; // Fecha o modal após salvar

        if (mbt.length < 8) {
            btnAdd.classList.remove("hide")
        }

    } else {
        console.error('Erro ao remover a matéria');
    }
}


// Função auxiliar para pegar o CSRF token (necessário no Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

