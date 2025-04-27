from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment, Subscription, UserSubscription
from .serializers import PaymentSerializer, SubscriptionSerializer, UserSubscriptionSerializer
from bookings.models import Booking

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        if self.request.user.user_type in ['staff', 'admin']:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        booking_id = self.request.data.get('booking')
        booking = Booking.objects.get(id=booking_id)
        
        # Проверка, что пользователь платит за свое бронирование
        if booking.user != self.request.user and self.request.user.user_type not in ['staff', 'admin']:
            return Response(
                {'error': 'У вас нет прав на оплату этого бронирования'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save(user=self.request.user)
        
        # Обновление статуса бронирования
        booking.status = 'confirmed'
        booking.save()

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
    
    def get_queryset(self):
        if self.request.user.user_type in ['staff', 'admin']:
            return UserSubscription.objects.all()
        return UserSubscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)