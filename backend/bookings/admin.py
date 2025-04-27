from django.contrib import admin
from .models import SportHall, Service, Schedule, Booking

@admin.register(SportHall)
class SportHallAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'capacity', 'price_per_hour')
    search_fields = ('name', 'address')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport_hall', 'price', 'duration')
    list_filter = ('sport_hall',)
    search_fields = ('name',)

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('sport_hall', 'get_day_display', 'start_time', 'end_time')
    list_filter = ('sport_hall', 'day_of_week')
    
    def get_day_display(self, obj):
        return obj.get_day_of_week_display()
    get_day_display.short_description = 'День недели'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'sport_hall', 'date', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'date', 'sport_hall')
    search_fields = ('user__email', 'sport_hall__name')
    date_hierarchy = 'date'
