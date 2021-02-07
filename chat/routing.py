from django.urls import re_path
from chat import comsumers

websocket_urlpatterns =[
    #调用类方法,实现ASGI实例化,
    re_path(r"ws/chat/(?P<room_name>\w+)/$",comsumers.ChatConsumer.as_asgi()),
]
