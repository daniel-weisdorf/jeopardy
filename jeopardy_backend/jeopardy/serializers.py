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
		exclude = ['category', 'answer']

class HostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Host
		exclude = ['game']

class CategorySerializer(serializers.ModelSerializer):
	questions = QuestionSerializer(many=True)
	class Meta:
		model = Category
		exclude = ['game']

class PlayerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Player
		fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
	players = PlayerSerializer(many=True)
	class Meta:
		model = Team
		exclude = ['game']

class GameSerializer(serializers.ModelSerializer):
	categories = CategorySerializer(many=True)
	teams = TeamSerializer(many=True)
	host = HostSerializer()
	is_player_answering = serializers.BooleanField()
	picking_team_id = serializers.IntegerField()
	selected_question = serializers.SerializerMethodField()

	def get_selected_question(self, obj):
		if obj.selected_question():
			return QuestionSerializer(obj.selected_question()).data
		return None

	class Meta:
		model = Game
		fields = '__all__'