import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from jeopardy.models import Game, Player
from jeopardy.serializers import GameSerializer
import random

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
        data_json = json.loads(text_data)
        message_type = data_json['type']
        # Send message to room group
        if message_type == 'game_update':
            self.send_game_update()

        elif message_type == 'buzz':
            self.set_buzz(data_json)

        elif message_type == 'start_game':
            self.start_game()

    def send_game_update(self):
        game = Game.objects.get(room_code=self.room_name)
        data = GameSerializer(game).data
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type': 'chat_message',
                'data': data
            }
        )
    
    def set_buzz(self, data_json):
        game = Game.objects.get(room_code=self.room_name)
        if game.is_player_answering:
            # Return failed to buzz
            pass
        elif game.is_complete:
            pass
            # Return error
        else:
            uuid = data_json['uuid']
            player = Player.objects.get(id=uuid)
            player.is_answering = True
            player.save()
        self.send_game_update()

    def start_game(self):
        game = Game.objects.get(room_code=self.room_name)
        if game.is_complete or game.picking_team_id != 0:
            # something wrong
            pass
        
        team_count = len(game.teams.all())
        starting_team = random.randrange(0, team_count)
        team = game.teams.all()[starting_team]
        team.is_picking = True
        team.save()

        self.send_game_update()


    def chat_message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'data': event['data']
        }))