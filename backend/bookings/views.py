from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import SportHall, Service, Schedule, Booking
from .serializers import SportHallSerializer, ServiceSerializer, ScheduleSerializer, BookingSerializer

class SportHallViewSet(viewsets.ModelViewSet):
    queryset = SportHall.objects.all()
    serializer_class = SportHallSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Service.objects.all()
        hall_id = self.request.query_params.get('hall_id')
        if hall_id:
            queryset = queryset.filter(sport_hall_id=hall_id)
        return queryset

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Schedule.objects.all()
        hall_id = self.request.query_params.get('hall_id')
        if hall_id:
            queryset = queryset.filter(sport_hall_id=hall_id)
        return queryset

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        if self.request.user.user_type in ['staff', 'admin']:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.user != request.user and request.user.user_type not in ['staff', 'admin']:
            return Response(
                {'error': 'У вас нет прав на отмену этого бронирования'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'cancelled'
        booking.save()
        return Response({'status': 'booking cancelled'})