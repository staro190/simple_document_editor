import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import axios from 'axios'

// 확장 기능 import
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'

import MenuBar from './MenuBar'
import VideoNode from './extensions/VideoNode' // 위에서 만든 컴포넌트
import { VideoExtension } from './extensions/VideoExtension'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      VideoExtension,
      // 1. 이미지
      Image,
      // 2. 표 (Resizable 기능 포함)
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      // 3. 글꼴 및 스타일
      TextStyle,
      FontFamily,
      Color,
    ],
    content: `
      <h2>환영합니다!</h2>
      <p>AI 문서 에디터입니다.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[500px] max-w-none',
      },
    },
  })

const saveDocument = async () => {
    // 1. 에디터의 JSON 데이터 추출
    const contentJson = editor.getJSON() 
    
    // 2. 문서 제목 (임시로 입력받거나 고정)
    const title = window.prompt("문서 제목을 입력하세요", "새 문서")
    if (!title) return

    try {
      // 3. Django API로 POST 요청 전송
      const response = await axios.post('http://127.0.0.1:8000/api/documents/', {
        title: title,
        content: contentJson 
      })

      if (response.status === 201) {
        alert("✅ 저장 성공! DB에 데이터가 안전하게 저장되었습니다.")
        console.log("서버 응답:", response.data)
      }
    } catch (error) {
      console.error("저장 실패:", error)
      alert("❌ 저장 중 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인하세요.")
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-200 py-8">
      
      {/* 상단 툴바 (간소화) */}
      <div className="sticky top-4 z-10 bg-white shadow-md rounded-lg px-4 py-2 mb-4 flex gap-2">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 border rounded hover:bg-gray-100 font-bold"
        >
          B
        </button>
        <button 
          onClick={() => editor.chain().focus().insertContent('<custom-video></custom-video>').run()}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          🎥 영상 추가
        </button>
        <button 
          onClick={saveDocument}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
        >
          💾 저장 (Dataset)
        </button>
      </div>

      {/* A4 용지 에디터 */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor