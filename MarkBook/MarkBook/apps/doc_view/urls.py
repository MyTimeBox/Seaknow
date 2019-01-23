from django.urls import path
from MarkBook.apps.doc_view.views import *


urlpatterns = [
    path('', index)
]