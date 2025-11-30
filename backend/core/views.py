from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document
from .serializers import DocumentSerializer
import openai
from django.conf import settings

# ★ 여기에 OpenAI API 키를 입력하세요
openai.api_key = "sk-..." 

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-created_at')
    serializer_class = DocumentSerializer

class ImageUploadView(APIView):
    """에디터 내 이미지 업로드 처리"""
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)
        
        # 실제로는 여기서 모델에 저장하거나 S3에 올립니다.
        # 편의상 FileSystemStorage 사용 예시를 생략하고, 로컬 URL 리턴 로직만 가정합니다.
        # 실무 코드:
        from django.core.files.storage import default_storage
        file_name = default_storage.save(file_obj.name, file_obj)
        file_url = default_storage.url(file_name)
        
        # 로컬 개발 환경용 URL 만들기 (settings.MEDIA_URL 활용)
        full_url = request.build_absolute_uri(file_url)
        return Response({'url': full_url})

class AIAssistView(APIView):
    """AI 문서 작성 도우미"""
    def post(self, request):
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': '프롬프트가 없습니다.'}, status=400)

        try:
            # OpenAI API 호출 (GPT-3.5 or 4)
            # 비용 문제로 주석 처리 된 부분입니다. 키가 있다면 주석을 푸세요.
            """
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "당신은 전문적인 문서 작성을 돕는 AI입니다. HTML 태그를 사용하여 문서를 구조화해주세요."},
                    {"role": "user", "content": prompt}
                ]
            )
            ai_text = response.choices[0].message.content
            """
            
            # [테스트용] 가짜 응답 (API 키 없이 테스트 가능)
            ai_text = f"""
            <h3>AI가 생성한 결과: {prompt}</h3>
            <p>이 내용은 <strong>AI(Django Backend)</strong>에서 생성되었습니다.</p>
            <ul>
                <li>항목 1: 데이터 분석</li>
                <li>항목 2: 결과 도출</li>
            </ul>
            """
            
            return Response({'result': ai_text})

        except Exception as e:
            return Response({'error': str(e)}, status=500)