from django.db import models

# Create your models here.
class Game(models.Model):
    room_code = models.CharField(max_length=10)
    is_complete = models.BooleanField(default=False)

class Team(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    is_picking = models.BooleanField(default=False)

class Player(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    is_captain = models.BooleanField(default=False)
    is_answering = models.BooleanField(default=False)

class Category(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

class Question(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200, null=True, blank=True)
    value = models.IntegerField()
    is_answered = models.BooleanField(default=False)
    is_daily_double = models.BooleanField(default=False)