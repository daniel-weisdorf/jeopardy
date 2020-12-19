from django.urls import re_path

from jeopardy.consumers import GameConsumer

websocket_urlpatterns = [
    re_path(r'ws/jeopardy/(?P<room_name>\w+)/$', GameConsumer.as_asgi()),
]