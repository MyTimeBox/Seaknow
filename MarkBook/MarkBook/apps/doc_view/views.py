from django.shortcuts import render

from MarkBook.model_proxies.book_info_proxy import BookInfo


def index(request):
    books = BookInfo.objects.order_by('-create_time').all()
    data = request.POST
    name = data.get('book')
    if name or name == '':
        books = books.filter(name__contains=name) if name != '' else books
        return render(request, 'doc_view/_book_list.html', locals())
    return render(request, 'doc_view/index.html', locals())