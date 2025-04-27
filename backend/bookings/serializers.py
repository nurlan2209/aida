from rest_framework import serializers
from .models import SportHall, Service, Schedule, Booking

class SportHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = SportHall
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Schedule
        fields = ('id', 'sport_hall', 'day_of_week', 'day_of_week_display', 'start_time', 'end_time')

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('status', 'created_at', 'updated_at')