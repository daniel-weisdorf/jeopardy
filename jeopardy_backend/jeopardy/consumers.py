import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from jeopardy.models import Game, Player, Question, Team
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
		if message_type == 'buzz':
			self.set_buzz(data_json)
		elif message_type == 'start_game':
			self.start_game()
		elif message_type == 'select_question':
			self.select_question(data_json)
		elif message_type == 'show_question':
			self.show_question()
		elif message_type == 'question_answered':
			self.question_answered(data_json)
		elif message_type == 'skip_question':
			self.skip_question()
		elif message_type == 'game_update':
			self.send_game_update()

	def set_buzz(self, data_json):
		game = Game.objects.get(room_code=self.room_name)
		if game.player_answering():
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

	def select_question(self, data_json):
		question = Question.objects.get(id=data_json['question_id'])
		team = Team.objects.get(id=data_json['team_id'])

		if question.category.game.is_complete or not team.is_picking:
			# something wrong
			pass

		question.is_selected = True
		question.save()
		team.is_picking = False
		team.save()

		self.send_game_update()
	
	def show_question(self):
		game = Game.objects.get(room_code=self.room_name)
		game.show_full_question = True
		game.save()
		self.send_game_update()

	def question_answered(self, data_json):
		game = Game.objects.get(room_code=self.room_name)
		player = game.player_answering()
		question = game.selected_question()
		team = player.team

		if data_json['data'] == 'right':
			team.score += question.value
			team.is_picking = True
			question.is_answered = True
			question.is_selected = False
			game.show_full_question = False
			game.save()
			question.save()

		elif data_json['data'] == 'wrong':
			team.score -= question.value

		team.save()
		player.is_answering = False
		player.save()
		self.send_game_update()

	def skip_question(self):
		game = Game.objects.get(room_code=self.room_name)
		if game.player_answering():
			pass
		question = game.selected_question()
		question.is_answered = True
		question.is_selected = False
		question.save()

		team_count = len(game.teams.all())
		starting_team = random.randrange(0, team_count)
		team = game.teams.all()[starting_team]
		team.is_picking = True
		team.save()

		game.show_full_question = False
		game.save()

		self.send_game_update()

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

	def chat_message(self, event):
		# Send message to WebSocket
		self.send(text_data=json.dumps({
			'data': event['data']
		}))