from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from jeopardy.serializers import GameSerializer
from jeopardy.models import Game, Host, Category, Question, Player, Team

import string, json
from django.utils.crypto import get_random_string

def index(request):
    return HttpResponse("Hello, world. You're at the jeopardy index.")

class GameViewset(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

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
                question = Question.objects.create(category=category, question=question_json['question'], value = question_no * 200, answer=answer)
                question_no += 1
        
        return HttpResponse(GameSerializer(game))



        



    