from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from jeopardy.serializers import GameSerializer, TeamSerializer, PlayerSerializer, QuestionSerializer, CategorySerializer
from jeopardy.models import Game, Host, Category, Question, Player, Team

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import string, json
from django.utils.crypto import get_random_string

def send_game_update(room_code):
	channel_layer = get_channel_layer()
	game = Game.objects.get(room_code=room_code)
	data = GameSerializer(game).data
	async_to_sync(channel_layer.group_send)(
		room_code,
		{
			'type': 'chat_message',
			'data': data
		}
	)

class GameViewset(viewsets.ModelViewSet):
	serializer_class = GameSerializer
	queryset = Game.objects.all()
	
	http_method_names = ['get', 'post']

	def create(self, request):
		game_json = request.data
		room_code = None
		while not room_code:
			room_code = get_random_string(length=10, allowed_chars=string.ascii_uppercase)
			if len(Game.objects.filter(room_code=room_code)):
				room_code = None

		# Validation is for chumps
		game = Game.objects.create(room_code=room_code)
		host = Host.objects.create(game=game, name=game_json['host_name'])

		for category_json in game_json['categories']:
			category = Category.objects.create(game=game, name=category_json['name'])
			question_no = 1
			for question_json in category_json['questions']:
				answer = question_json['answer'] if 'answer' in question_json else None
				is_picture_question = question_json['is_picture_question'] if 'is_picture_question' in question_json else False
				question = Question.objects.create(
					category=category,
					question=question_json['question'],
					value = question_no * 200,
					answer=answer,
					is_picture_question=is_picture_question,
				)
				question_no += 1

		game.refresh_from_db()
		return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
	
	def list(self, request):
		# not actually a list, sue me
		room_code = request.query_params.get('roomCode')
		game = get_object_or_404(Game, room_code=room_code)
		return Response(GameSerializer(game).data)

class TeamViewset(viewsets.ModelViewSet):
	serializer_class = TeamSerializer
	queryset = Team.objects.all()

	http_method_names = ['post']

	def create(self, request):
		team_json = request.data
		game = get_object_or_404(Game, room_code=team_json['room_code'])
		if game.is_complete:
			return Response('Game is already done', status=status.HTTP_400_BAD_REQUEST)

		team = Team.objects.create(game=game, name=team_json['name'])
		player = Player.objects.create(team=team, name=team_json['captain_name'], is_captain=True)

		team.refresh_from_db()
		send_game_update(game.room_code)

		return Response(PlayerSerializer(player).data, status=status.HTTP_201_CREATED)

class PlayerViewset(viewsets.ModelViewSet):
	serializer_class = PlayerSerializer
	queryset = Player.objects.all()

	http_method_names = ['post']

	def create(self, request):
		player_json = request.data
		team = get_object_or_404(Team, id=player_json['team_id'])

		if team.game.is_complete:
			return Response('Game is already done', status=status.HTTP_400_BAD_REQUEST)

		player = Player.objects.create(team=team, name=player_json['player_name'])

		send_game_update(team.game.room_code)
		return Response(PlayerSerializer(player).data, status=status.HTTP_201_CREATED)
