from django.shortcuts import render


def index(request):
    return render(request, 'doc_share/index.html', locals())
