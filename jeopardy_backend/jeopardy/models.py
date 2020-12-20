from django.db import models
import uuid

# Create your models here.
class Game(models.Model):
	room_code = models.CharField(max_length=10, unique=True)
	is_complete = models.BooleanField(default=False)

	def is_player_answering(self):
		teams = self.teams.all()
		for team in teams:
			if len(team.players.all().filter(is_answering=True)):
				return True
		return False

	def picking_team_id(self):
		teams = self.teams.all()
		for team in teams:
			if team.is_picking:
				return team.id
		return 0
	
	def selected_question(self):
		categories = self.categories.all()
		for category in categories:
			query = category.questions.all().filter(is_selected=True)
			if len(query):
				return query[0]
		return None

	def __str__(self):
		return self.room_code

class Team(models.Model):
	game = models.ForeignKey(Game, related_name='teams', on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	score = models.IntegerField(default=0)
	is_picking = models.BooleanField(default=False)

	def __str__(self):
		return self.name

class Player(models.Model):
	team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	is_captain = models.BooleanField(default=False)
	is_answering = models.BooleanField(default=False)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

	def __str__(self):
		return self.name

class Host(models.Model):
	game = models.OneToOneField(Game, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)

class Category(models.Model):
	game = models.ForeignKey(Game, related_name='categories', on_delete=models.CASCADE)
	name = models.CharField(max_length=200)

	def __str__(self):
		return self.name

class Question(models.Model):
	category = models.ForeignKey(Category, related_name='questions', on_delete=models.CASCADE)
	question = models.CharField(max_length=200)
	answer = models.CharField(max_length=200, null=True, blank=True)
	value = models.IntegerField()
	is_answered = models.BooleanField(default=False)
	is_selected = models.BooleanField(default=False)
	is_daily_double = models.BooleanField(default=False)
	is_picture_question = models.BooleanField(default=False)

	def __str__(self):
		return self.question