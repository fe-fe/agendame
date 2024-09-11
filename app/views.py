from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Materia, Nota
from django.shortcuts import get_object_or_404
import json


@login_required(login_url="login_user")
def index(request):

    if request.method == "GET":

        context = {"name": request.user.username}

        materias = Materia.objects.filter(user=request.user).values()
        
        faltas = 0
        horas = 0

        baixas = []

        for m in materias:
            faltas += m["faltas"]
            horas += m["horas"]

            if m["horas"] != 0:
                mfreq = ((m["horas"] - m["faltas"]) / m["horas"]) * 100
                if mfreq < 85:
                    baixas.append(
                        {
                            "nome": m["nome"],
                            "freq": round(mfreq, 2)
                        }
                    )

        context["baixas"] = baixas

        if horas == 0:
            context["freq"] = 100
        else:
            freq = ((horas - faltas) / horas) * 100 
            context["freq"] = round(freq, 2)

        context["materias"] = materias
        
        return render(request, "index.html", context=context)
    

def login_user(request):

    if request.method == "GET":

        if request.user.is_authenticated:
            return redirect("painel")
        else:
            context = {"erro": "", "classerror":""}
            return render(request, "login.html", context=context)
    
    elif request.method == "POST":
        un = request.POST['username']
        pw = request.POST['password']
        user = authenticate(request, username=un, password=pw)

        if user is not None:
            login(request, user)
            return redirect("painel")
        else:
            context = {"erro": "usuario ou senha estao incorretos", "classerror": "ierr"}
            return render(request, "login.html", context=context)


def cadastro(request):

    if request.method == "GET":

        if request.user.is_authenticated:
            return redirect("painel")
        else:
            return render(request, "cadastro.html")

    elif request.method == "POST":

        un = request.POST["username"]

        if User.objects.filter(username=un).count() > 0:
            context = {"erro": "usuario ja existe"}
            return render(request, "cadastro.html", context=context)

        pw = request.POST["password"]

        user = User.objects.create_user(username=un, password=pw)
        login(request, user)

        return redirect("painel")


def logout_user(request):
    logout(request)
    return redirect("login_user")


@login_required
def materias(request):

    if request.method == "POST":

        if request.POST["action"] == "ADD":

            user = request.user
            nome = request.POST["nomeMateria"]

            Materia.objects.create(
                user=user,
                nome=nome
            )
            return HttpResponse("materia criada")
    
        elif request.POST["action"] == "REM":

            matid = request.POST["matid"]
            Materia.objects.filter(id=matid).delete()
            return HttpResponse("materia removida")


@login_required
def ver_materia(request, id):
    if request.method == "GET":

        materia = get_object_or_404(Materia, id=id)
        notas = Nota.objects.filter(materia=materia.id).values()

        if request.user != materia.user:
            return redirect("painel")
        else:
            return render(request, "materia.html", context={"materia": materia, "notas": notas})
        

def editar_materia(request):

    if request.method == "POST":

        action = request.POST["action"]
        
        if action == "ADD":
            try:
                matid = int(request.POST["matid"])
                materia = Materia.objects.get(id=matid)
                nome = request.POST["nomeNota"]

                Nota.objects.create(
                    nome=nome,
                    materia=materia
                )
                return HttpResponse("deu certo")
            except:
                return HttpResponse("erro")
        
        elif action == "EDIT":
            
            try:
                matid = int(request.POST["matid"])
                horas = request.POST["horas"]
                faltas = request.POST["faltas"]
                notas = request.POST["notas"]

                notas = json.loads(notas)

                materia = Materia.objects.filter(id=matid).update(
                    horas=horas,
                    faltas=faltas
                )

                for n in notas:
                    Nota.objects.filter(id=n["id"]).update(
                        nome=n["nome"],
                        peso=n["peso"],
                        resultado=n["resultado"]
                    )

                return HttpResponse("edicoes foram salvadas")
            except:
                return HttpResponse("erro")

        elif action == "REM":
            
            notid = request.POST["notid"]
            Nota.objects.filter(id=notid).delete()
            return HttpResponse("materia removida")