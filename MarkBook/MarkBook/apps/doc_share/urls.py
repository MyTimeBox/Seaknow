from django.urls import path
from MarkBook.apps.doc_share.views import *


urlpatterns = [
    path('index', index)
]