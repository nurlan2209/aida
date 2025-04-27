from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'phone', 'user_type', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone')
    readonly_fields = ('date_joined', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'phone', 'profile_picture')}),
        ('Права доступа', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'first_name', 'last_name', 'phone', 'user_type'),
        }),
    )
    
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)