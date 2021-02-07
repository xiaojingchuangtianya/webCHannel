from django.urls import path
from chat import views
urlpatterns=[
    path("",views.index),
    path("room<str:room>/",views.room),
    path("try",views.dotry),
]
