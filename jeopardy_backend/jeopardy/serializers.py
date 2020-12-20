from rest_framework import serializers
from jeopardy.models import Game, Team, Player, Category, Question, Host

class QuestionSerializer(serializers.ModelSerializer):
	category_name = serializers.SerializerMethodField()

	def get_category_name(self, obj):
		return obj.category.name
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
	category_name = serializers.SerializerMethodField()

	def get_category_name(self, obj):
		return obj.category.name

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
	player_answering = serializers.SerializerMethodField()
	picking_team_id = serializers.IntegerField()
	selected_question = serializers.SerializerMethodField()

	def get_selected_question(self, obj):
		selected_question = obj.selected_question()
		if selected_question:
			if obj.show_full_question:
				return QuestionDetailSerializer(selected_question).data
			else:
				return QuestionSerializer(selected_question).data
		return None

	def get_player_answering(self, obj):
		player_answering = obj.player_answering()
		if player_answering:
			return PlayerSerializer(player_answering).data
		return None

	class Meta:
		model = Game
		fields = '__all__'