from django.contrib import admin
from django.urls import path
from judgeMain.views import listorders
from judgeMain.views import imageProcessing
from judgeMain.views import video
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('judge/', listorders),
    path('imageProcessing/',imageProcessing),
    path('video/',video)
]
