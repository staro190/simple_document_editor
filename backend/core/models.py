from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=200, default="제목 없음")
    
    # ★ 핵심: Tiptap의 JSON 데이터를 그대로 저장
    # 텍스트가 아니라 구조화된 데이터(이미지, 표, 비디오 파라미터 포함)가 들어갑니다.
    content = models.JSONField(default=dict) 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title