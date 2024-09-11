"""
URL configuration for estudos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('painel', index, name="painel"),
    path("login", login_user, name="login_user"),
    path("cadastro", cadastro, name="cadastro"),
    path("logout", logout_user, name="logout_user"),
    path("materias", materias, name="materias"),
    path("materias/<int:id>", ver_materia, name="ver_materia"),
    path("edit", editar_materia, name="editar_materia"),
]
