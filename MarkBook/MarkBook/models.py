from django.db import models


class BookInfosAbstract(models.Model):
    name = models.CharField('书名', max_length=255, null=False)
    img_url = models.CharField('封面图片', max_length=50, null=True)
    file_path = models.CharField('文件地址', max_length=100, null=False)
    # upload_by = models.ForeignKey('Users', on_delete=models.CASCADE,
    #                               related_name='create_user', db_constraint=False)
    create_time = models.DateField('创建时间', auto_now=True)
    update_time = models.DateField('更新时间', auto_now=True)

    class Meta:
        verbose_name = '文档信息表'
        db_table = 'book_info'