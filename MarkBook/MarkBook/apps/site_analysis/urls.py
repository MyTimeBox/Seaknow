from django.urls import path
from MarkBook.apps.site_analysis.views import *


urlpatterns = [
    path('index',  index)
]