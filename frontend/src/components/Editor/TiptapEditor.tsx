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

// ★ MenuBar 컴포넌트 import
import MenuBar from './MenuBar'
import { VideoExtension } from './extensions/VideoExtension'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      VideoExtension,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      FontFamily,
      Color,
    ],
    content: `
      <h2>환영합니다!</h2>
      <p>AI 문서 에디터입니다.</p>
      <p>위 메뉴바를 사용하여 표, 이미지, 비디오 등을 추가해보세요.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[500px] max-w-none',
      },
    },
  })

  // 저장 로직
  const saveDocument = async () => {
    if (!editor) return

    const contentJson = editor.getJSON() 
    
    const title = window.prompt("문서 제목을 입력하세요", "새 문서")
    if (!title) return

    try {
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

  // 에디터 로딩 전에는 아무것도 보여주지 않음 (Null 에러 방지)
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-200 py-8">
      
      {/* ★ [수정된 부분] 
        예전의 하드코딩된 버튼들을 지우고, 
        우리가 만든 MenuBar 컴포넌트를 끼워 넣었습니다.
      */}
      <div className="w-[210mm] z-10">
        <MenuBar editor={editor} />
      </div>

      {/* 저장 버튼은 메뉴바와 분리하여 우측 상단에 고정 */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={saveDocument}
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 font-bold transition-all"
        >
          💾 저장 (Dataset)
        </button>
      </div>

      {/* A4 용지 에디터 영역 */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor