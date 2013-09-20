from django.contrib import admin
from zombie.apps.login.models import ZombieUser, Map

admin.site.register(ZombieUser)
admin.site.register(Map)