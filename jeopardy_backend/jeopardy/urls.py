from django.urls import path, include
from jeopardy import views
from rest_framework import routers
router = routers.DefaultRouter()
router.register(r'games', views.GameViewset, 'game')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.index, name='index'),
]