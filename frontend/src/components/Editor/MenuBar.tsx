import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import axios from 'axios';

interface MenuBarProps {
  editor: Editor | null;
  onSave: () => void; // 저장 함수를 부모에게서 받아옵니다
}

const MenuBar = ({ editor, onSave }: MenuBarProps) => {
  const [title, setTitle] = useState("무제 문서");

  if (!editor) return null;

  // AI 어시스트
  const handleAIAssist = async () => {
    const userPrompt = window.prompt("AI에게 무엇을 시키시겠습니까? (예: 목차 생성해줘)");
    if (!userPrompt) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/ai/assist/', {
        prompt: userPrompt
      });
      editor.chain().focus().insertContent(response.data.result).run();
    } catch (e) {
      alert("AI 서버 연결 실패");
    }
  };

  // 이미지 업로드
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/upload/image/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          editor.chain().focus().setImage({ src: res.data.url }).run();
        } catch (err) {
          alert("이미지 업로드 실패");
        }
      }
    };
    input.click();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex flex-col font-sans">
      
      {/* === [1단] 상단 타이틀 바 (로고, 제목, 저장, AI) === */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          {/* 로고 영역 */}
          <div className="flex items-center gap-2 text-blue-600 font-black text-xl">
            📝 Web Documentation
          </div>
          
          {/* 문서 제목 입력 */}
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium text-gray-700 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1"
            placeholder="문서 제목을 입력하세요"
          />
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={handleAIAssist}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md shadow-sm hover:opacity-90 font-bold text-sm flex items-center gap-2"
          >
            ✨ AI Assist
          </button>
          <button 
            onClick={onSave} // 부모에게서 받은 저장 함수 실행
            className="px-4 py-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 font-bold text-sm"
          >
            💾 저장하기
          </button>
        </div>
      </div>

      {/* === [2단] 편집 툴바 (리본 메뉴 스타일) === */}
      <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-b border-gray-300 overflow-x-auto">
        
        {/* 그룹 1: 텍스트 스타일 */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-1">
          <select 
            className="h-8 border border-gray-300 rounded px-2 text-sm bg-white cursor-pointer hover:border-blue-400 focus:outline-none"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          >
            <option value="Inter">기본 서체</option>
            <option value="serif">명조체 (Serif)</option>
            <option value="monospace">고정폭 (Code)</option>
            <option value="Comic Sans MS">필기체</option>
          </select>

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300 text-blue-800' : 'text-gray-700'}`}
            title="굵게"
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300 text-blue-800' : 'text-gray-700'}`}
            title="기울임"
          >
            <i>I</i>
          </button>
           <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300 text-blue-800' : 'text-gray-700'}`}
            title="취소선"
          >
            <s>S</s>
          </button>
        </div>

        {/* 그룹 2: 삽입 도구 */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-1">
          <button onClick={handleImageUpload} className="h-8 px-2 flex items-center gap-1 rounded hover:bg-gray-200 text-sm" title="이미지">
            🖼️ <span className="hidden sm:inline">사진</span>
          </button>
          <button onClick={() => editor.chain().focus().insertContent('<custom-video></custom-video>').run()} className="h-8 px-2 flex items-center gap-1 rounded hover:bg-gray-200 text-sm" title="비디오">
            🎥 <span className="hidden sm:inline">영상</span>
          </button>
          <button 
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="h-8 px-2 flex items-center gap-1 rounded hover:bg-gray-200 text-sm" title="표"
          >
            📅 <span className="hidden sm:inline">표</span>
          </button>
        </div>

        {/* 그룹 3: 정렬 및 목록 */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-1">
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="w-8 h-8 rounded hover:bg-gray-200 text-lg" title="글머리 기호">•</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="w-8 h-8 rounded hover:bg-gray-200 text-sm" title="번호 매기기">1.</button>
        </div>

        {/* 그룹 4: 표 컨트롤 (동적 표시) */}
        {editor.isActive('table') && (
          <div className="flex items-center gap-1 bg-blue-50 px-2 rounded border border-blue-200 animate-fadeIn">
            <span className="text-xs text-blue-600 font-bold mr-1">표 도구:</span>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs bg-white border px-1 py-1 rounded hover:bg-blue-100">열 추가</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs bg-white border px-1 py-1 rounded hover:bg-blue-100">행 추가</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="text-xs bg-white border border-red-200 text-red-500 px-1 py-1 rounded hover:bg-red-50">표 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBar;