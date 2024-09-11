const add = document.getElementById("add");
const rem = document.getElementById("rem");
const btnAdd = document.getElementById("addbt");
const btnRem = document.getElementById("rembt");
const closeBtnAdd = document.getElementById("closeadd");
const closeBtnRem = document.getElementById("closerem");
const rselect = document.getElementById("rselect");
const nqtd = document.querySelectorAll(".nqtd");
const url = document.getElementById("submitadd").getAttribute("data-url");
const matid = document.getElementById("mainnota").getAttribute("matid");
const horas = document.getElementById("horas");
const faltas = document.getElementById("faltas");

window.addEventListener("load", function() {
    if (nqtd.length == 4) {
        btnAdd.classList.add("hide");
    }
    gerarFreq();
    gerarMedia();
    startTypingListener();
});

// Mostra o popup quando o botão "Adicionar" for clicado
btnAdd.onclick = function() {

    if (nqtd.length >= 4) {
        alert("Voce so pode ter 8 materias simultaneamente.")
    } else {
        add.style.display = "flex";
    }
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


async function salvar(){
    const h = horas.value;
    const f = faltas.value;
    const notas = [];

    document.querySelectorAll(".nt").forEach(notabox => {
        const nome = notabox.querySelector('.ntn').value;
        const peso = notabox.querySelector('.ntp').value;
        const resultado = notabox.querySelector('.ntr').value;
        const id = notabox.querySelector('.notainput').id;

        notas.push({
            id: id,
            nome: nome,
            peso: peso,
            resultado: resultado
        });
        
    });
    console.log("aaaaa");
    console.log(notas);

    const formData = new FormData();
    formData.append("horas", h);
    formData.append("faltas", f);
    formData.append("notas", JSON.stringify(notas));
    formData.append('action', "EDIT");
    formData.append('matid', matid);

    try {
        const response = await $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // CSRF token necessário para Django
            }
        });
        location.reload()
    } catch (error) {
        console.error("erro ao salvar edicoes");
    }
}


function gerarFreq() {
    const h = parseInt(horas.value);
    const f = parseInt(faltas.value);

    if (isNaN(h+f)) {
        document.getElementById("freqq").innerHTML = " invalida";
    } else {
        const freq = (h - f) / (h) * 100;
        document.getElementById("freqq").innerHTML = ": " + freq.toFixed(2) + "%";
    }

    
}


// Manipulação do envio do formulário
async function addsubmit(event) {

    await salvar();
    if (nqtd.length === 4) {
        return
    } else if (add.style.display == "flex") {
        const nome = document.getElementById("nomeNota").value;
        
        // Criando um FormData para enviar via POST
        const formData = new FormData();
        formData.append('nomeNota', nome);
        formData.append('matid', matid);
        formData.append('action', "ADD");
        
        try {
            const response = await $.ajax({
                url: url,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // CSRF token necessário para Django
                }
            });

            if (response) {
                add.style.display = "none";
                location.reload()
            } else {
                console.error("erro ao adicionar nota");
            }
        } catch (error) {
            console.error("erro ao adicionar nota");
        }

    }
}

// Manipulação do envio do formulário
async function remsubmit() {
    
    await salvar();
    
    const url = document.getElementById("submitrem").getAttribute("data-url");
    var options = rselect.options;
    var notid = options[options.selectedIndex].id;
    
    // Criando um FormData para enviar via POST
    const formData = new FormData();
    formData.append('notid', notid);
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
        location.reload()
        if (nqtd.length < 4) {
            btnAdd.classList.remove("hide")
        }

    } else {
        console.error('Erro ao remover a nota');
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

let typingTimer; // Temporizador
const doneTypingInterval = 1000; // Tempo em milissegundos (1 segundo)

function startTypingListener() {
    const inputs = document.querySelectorAll('#horas, #faltas');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {

            const charCode = e.which ? e.which : e.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault(); // Impede a entrada de caracteres que não sejam números
            } else {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(gerarFreq, doneTypingInterval);
            }

            
        });

        input.addEventListener('keydown', () => {
            clearTimeout(typingTimer); // Limpa o temporizador toda vez que o usuário digita
        });
    });
    const ninputs = document.querySelectorAll(".notainput");
    ninputs.forEach(ninput => {
        ninput.addEventListener("input", (e) => {

            const charCode = e.which ? e.which : e.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault(); // Impede a entrada de caracteres que não sejam números
            } else {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(gerarMedia, doneTypingInterval);
            }
        })
        ninput.addEventListener('keydown', () => {
            clearTimeout(typingTimer); // Limpa o temporizador toda vez que o usuário digita
        });
    }) 
}

function gerarMedia() {

    let totalp = 0;
    let notapesosum = 0;
    const situacao = document.getElementById("situacao");
    const final = document.getElementById("final");
    const mediatxt = document.getElementById("media");

    document.querySelectorAll(".nt").forEach(notabox => {
        const peso = parseInt(notabox.querySelector('.ntp').value);
        const resultado = parseInt(notabox.querySelector('.ntr').value);

        if (isNaN(peso+resultado)) {
            console.log("errinho NaN");
        } else {
            totalp += peso;
            notapesosum += (peso * resultado);
        }

        

    });

    if (totalp == 0) {
        situacao.innerText = "Esperando notas para calcular"
        final.style.display = "none";
        mediatxt.innerText = "";
        
    } else {
        const media = notapesosum/totalp;

        mediatxt.innerText = media.toFixed(0);

    
        situacao.style.display = "block";

        if (media > 70) {
            
            situacao.innerHTML = "voce esta <strong>" + parseInt(media-70) + "</strong> pontos acima da media";
            final.style.display = "none";
        } else if (media == 70) {
            situacao.innerHTML = "voce esta na media";
            final.style.display = "none";
        } else {
            situacao.innerHTML = "voce precisa de <strong>" + parseInt(70 - media) + "</strong> para passar por media";
            final.style.display = "block";
            final.innerHTML = "ou de <strong>" + parseInt(100-media) + "</strong> para passar pela final";
        } 
    }

    

}