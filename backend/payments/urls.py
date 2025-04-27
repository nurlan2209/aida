from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, SubscriptionViewSet, UserSubscriptionViewSet

router = DefaultRouter()
router.register(r'transactions', PaymentViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'user-subscriptions', UserSubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]