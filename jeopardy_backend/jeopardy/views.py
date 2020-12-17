from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from jeopardy.serializers import GameSerializer
from jeopardy.models import Game

def index(request):
    return HttpResponse("Hello, world. You're at the jeopardy index.")

class GameViewset(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    