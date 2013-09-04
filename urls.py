from django.conf.urls import patterns, include, url
from zombie.apps.login.views import home

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'zombie.apps.login.views.home', name='home'),
)
