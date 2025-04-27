from django.db import models
from django.conf import settings

class SportHall(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    image = models.ImageField(upload_to='halls/', null=True, blank=True)
    capacity = models.PositiveIntegerField(default=20)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField(help_text="Длительность в минутах")
    sport_hall = models.ForeignKey(SportHall, on_delete=models.CASCADE, related_name='services')
    
    def __str__(self):
        return f"{self.name} - {self.sport_hall.name}"

class Schedule(models.Model):
    sport_hall = models.ForeignKey(SportHall, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.PositiveSmallIntegerField(choices=[
        (0, 'Понедельник'), 
        (1, 'Вторник'), 
        (2, 'Среда'), 
        (3, 'Четверг'), 
        (4, 'Пятница'), 
        (5, 'Суббота'), 
        (6, 'Воскресенье')
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    class Meta:
        unique_together = ('sport_hall', 'day_of_week', 'start_time')
    
    def __str__(self):
        return f"{self.sport_hall.name} - {self.get_day_of_week_display()} ({self.start_time}-{self.end_time})"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Ожидает оплаты'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
        ('completed', 'Завершено'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    sport_hall = models.ForeignKey(SportHall, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.sport_hall.name} ({self.date})"