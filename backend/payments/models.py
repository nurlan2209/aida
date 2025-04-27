from django.db import models
from django.conf import settings
from bookings.models import Booking

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('card', 'Банковская карта'),
        ('cash', 'Наличные'),
        ('online', 'Онлайн-платеж'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Ожидающий'),
        ('completed', 'Завершенный'),
        ('failed', 'Неудачный'),
        ('refunded', 'Возвращенный'),
    )
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} ({self.status})"

class Subscription(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    visits_count = models.PositiveIntegerField(null=True, blank=True)  # Количество посещений
    days_valid = models.PositiveIntegerField(default=30)  # Срок действия в днях
    
    def __str__(self):
        return self.name

class UserSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    visits_left = models.PositiveIntegerField(null=True, blank=True)  # Оставшиеся посещения
    payment = models.OneToOneField(Payment, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.subscription.name}"