from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, ImageUploadView, AIAssistView

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload/image/', ImageUploadView.as_view()), # 이미지 업로드 경로
    path('ai/assist/', AIAssistView.as_view()),       # AI 경로
]