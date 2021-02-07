"""
ASGI config for webChannels project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webChannels.settings')

apply= get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter,URLRouter

from chat import routing
application = ProtocolTypeRouter({

    "http": apply,#这个是http请求y
    "websocket":AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    )
    # Just HTTP for now. (We can add other protocols later.)
})




