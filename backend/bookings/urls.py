from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SportHallViewSet, ServiceViewSet, ScheduleViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'halls', SportHallViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]