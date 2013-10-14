from django.contrib import admin
from zombie.apps.login.models import ZombieUser, Map, ResetLink

admin.site.register(ZombieUser)
admin.site.register(Map)
admin.site.register(ResetLink)