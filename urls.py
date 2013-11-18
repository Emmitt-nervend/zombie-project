from django.conf.urls import patterns, include, url
from zombie.apps.login.views import home

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'zombie.apps.login.views.home', name='home'),
    url(r'^play/$', 'zombie.apps.login.views.play_option', name='play_option'),
    url(r'^sign-up/$', 'zombie.apps.login.views.sign_up', name='sign_up'),
    url(r'^success/$', 'zombie.apps.login.views.success', name='success'),
    url(r'^web/$', 'zombie.apps.login.views.web', name='web'),
    url(r'^guest/', 'zombie.apps.login.views.randomplay', name='randomplay'),
    url(r'^logout/', 'zombie.apps.login.views.logout_user', name='logout_user'),
    url(r'^password-reset/', 'zombie.apps.login.views.password_reset', name='password_reset'),
    url(r'^change-password/(?P<token>\w{10})', 'zombie.apps.login.views.change_password', name='change_password'),
    url(r'^rest/', include('zombie.apps.rest.urls', namespace='rest')),
    url(r'^admin/', include(admin.site.urls)),
)