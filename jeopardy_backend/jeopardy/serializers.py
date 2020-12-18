from rest_framework import serializers
from jeopardy.models import Game, Team, Player, Category, Question, Host

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = [
            'category',
            'question',
            'answer',
            'is_daily_double',
            'is_picture_question'
        ]

class QuestionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['category']

class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Host
        exclude = ['game']

class CategorySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(source='question_set')
    class Meta:
        model = Category
        exclude = ['game']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        exclude = ['team']

class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(source='player_set')
    class Meta:
        model = Team
        exclude = ['game']

class GameSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(source='category_set')
    teams = TeamSerializer(source='team_set')
    host = HostSerializer(source='host')
    class Meta:
        model = Game
        fields = '__all__'