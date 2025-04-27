from django.contrib import admin
from .models import Payment, Subscription, UserSubscription

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'booking', 'amount', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('user__email', 'booking__id', 'transaction_id')
    date_hierarchy = 'created_at'

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'visits_count', 'days_valid')
    search_fields = ('name',)

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscription', 'start_date', 'end_date', 'visits_left', 'is_active')
    list_filter = ('is_active', 'subscription', 'start_date')
    search_fields = ('user__email', 'subscription__name')
    date_hierarchy = 'start_date'