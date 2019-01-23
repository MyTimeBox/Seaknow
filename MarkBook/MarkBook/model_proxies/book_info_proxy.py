from MarkBook.models import BookInfosAbstract


class BookInfo(BookInfosAbstract):
    class Meta:
        proxy = True
