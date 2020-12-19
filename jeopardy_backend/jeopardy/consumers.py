import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from jeopardy.models import Game
from jeopardy.serializers import GameSerializer


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Send message to room group
        if (text_data == 'game_update'):
            game = Game.objects.get(room_code=self.room_name)
            data = GameSerializer(game).data
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    'type': 'chat_message',
                    'data': data
                }
            )

    def chat_message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'data': event['data']
        }))