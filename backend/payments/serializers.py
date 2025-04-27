from rest_framework import serializers
from .models import Payment, Subscription, UserSubscription

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('status', 'transaction_id', 'created_at', 'updated_at')

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    subscription_name = serializers.CharField(source='subscription.name', read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = ('id', 'user', 'subscription', 'subscription_name', 'start_date', 
                  'end_date', 'visits_left', 'payment', 'is_active')
