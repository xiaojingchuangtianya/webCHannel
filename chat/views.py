from django.shortcuts import render,redirect
from django.http.response import HttpResponse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
# Create your views here.

def index(request):
    return render(request,"chat/index.html")

def room(request,room):
    return render(request,"chat/room.html",context={"room_name":room})

def dotry(request):
    return render(request,"home/try.html")

def Mylogin(request):
    if request.method =="GET":
        return render(request,"login.html")
    elif request.method =="POST":
        if request.POST["username"] and request.POST["password"]:
            username=request.POST["username"]
            password =request.POST["password"]
            loginUser = authenticate(request,username=username,password=password)
            if loginUser is not None:
                login(request,loginUser)
                return redirect("/")
            else:
                return HttpResponse("用户账号或者密码错误,<a href='/login'>请重新登录</a>")
        return HttpResponse("账号密码不能为空,<a href='/login'>请重新登录</a>")

def Myregister(request):
    if request.method == "GET":
        return render(request, "register.html")
    elif request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        passwordAgain = request.POST["passwordAgain"]
        if User.objects.filter(username=username):
            return HttpResponse("账号已经被注册,请重新<a href='/register'>注册</a>")
        else:
            if password != passwordAgain:
                return HttpResponse("两次密码不一致<a href='/register'>注册</a>")
            else:
                newUser = User.objects.create_user(username=username, password=password)
                login(request, newUser)
                return redirect("/chat")


