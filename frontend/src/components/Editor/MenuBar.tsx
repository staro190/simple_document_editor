import React from 'react';
import { Editor } from '@tiptap/react';
import axios from 'axios';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  // 1. AI 어시스트 기능
  const handleAIAssist = async () => {
    const userPrompt = window.prompt("AI에게 무엇을 시키시겠습니까? (예: 사업계획서 목차 써줘)");
    if (!userPrompt) return;

    try {
      // 로딩 표시 등은 생략됨
      const response = await axios.post('http://127.0.0.1:8000/api/ai/assist/', {
        prompt: userPrompt
      });
      // AI가 준 HTML을 에디터에 삽입
      editor.chain().focus().insertContent(response.data.result).run();
    } catch (e) {
      alert("AI 서버 연결 실패 (백엔드 실행 여부를 확인하세요)");
      console.error(e);
    }
  };

  // 2. 이미지 업로드 기능
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
          // 에디터에 이미지 삽입
          editor.chain().focus().setImage({ src: res.data.url }).run();
        } catch (err) {
          console.error(err);
          alert("이미지 업로드 실패");
        }
      }
    };
    input.click();
  };

  return (
    <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-300 p-2 mb-4 flex flex-wrap gap-2 items-center rounded-t-lg">
      
      {/* --- 섹션 1: 텍스트 스타일 --- */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-bold hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm italic hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
        >
          I
        </button>
        
        {/* 글꼴 선택 */}
        <select 
          className="border border-gray-300 rounded px-1 py-1 text-sm bg-white ml-1 cursor-pointer hover:border-blue-400"
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        >
          <option value="Inter">기본 글꼴</option>
          <option value="Comic Sans MS">Comic Sans</option>
          <option value="serif">명조체 (Serif)</option>
          <option value="monospace">고정폭 (Code)</option>
        </select>
      </div>

      {/* --- 섹션 2: 멀티미디어 & 구조 --- */}
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        {/* 이미지 */}
        <button onClick={handleImageUpload} className="px-2 py-1 rounded hover:bg-gray-100 text-lg" title="이미지 업로드">
          🖼️
        </button>
        
        {/* 비디오 */}
        <button onClick={() => editor.chain().focus().insertContent('<custom-video></custom-video>').run()} className="px-2 py-1 rounded hover:bg-gray-100 text-lg" title="비디오 추가">
          🎥
        </button>

        {/* 표 삽입 */}
        <button 
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="px-2 py-1 rounded hover:bg-gray-100 text-sm font-medium" title="표 삽입"
        >
          📅 표 삽입
        </button>
      </div>

      {/* --- 섹션 3: 표 컨트롤 (표 선택 시에만 보임) --- */}
      {editor.isActive('table') && (
        <div className="flex items-center gap-1 bg-blue-50 px-2 rounded border border-blue-100 mr-2 animate-fadeIn">
          <span className="text-xs text-blue-500 font-bold mr-1">Table:</span>
          <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs hover:bg-blue-200 px-1 py-0.5 rounded">열+</button>
          <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs hover:bg-blue-200 px-1 py-0.5 rounded">행+</button>
          <button onClick={() => editor.chain().focus().deleteTable().run()} className="text-xs text-red-500 hover:bg-red-100 px-1 py-0.5 rounded font-bold">삭제</button>
        </div>
      )}

      {/* --- 섹션 4: AI --- */}
      <button 
        onClick={handleAIAssist}
        className="ml-auto px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow hover:shadow-md hover:opacity-90 flex items-center gap-1 font-bold text-sm transition-all"
      >
        ✨ AI 작성
      </button>
    </div>
  );
};

export default MenuBar;