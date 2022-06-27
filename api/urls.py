from django.urls import path
from . import views


urlpatterns = [
    path('buildings/', views.getBuildings),
    path('sisdolTrueColor/', views.getTrueColor),


]