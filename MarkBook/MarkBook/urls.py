"""MarkBook URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf.urls import include


urlpatterns = [
    # 文档查看相关url
    path('', include('MarkBook.apps.doc_view.urls')),

]

urlpatterns += [
    # 文档分享相关url
    path('doc_share/', include('MarkBook.apps.doc_share.urls')),

]

urlpatterns += [
    # 站内分析相关url
    path('site_analysis/', include('MarkBook.apps.site_analysis.urls')),

]