import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import axios from 'axios'

import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'

import MenuBar from './MenuBar'
import { VideoExtension } from './extensions/VideoExtension'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      VideoExtension,
      Image,
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TextStyle, FontFamily, Color,
    ],
    content: `
      <h2>환영합니다! AI 문서 에디터입니다.</h2>
      <p>상단 메뉴바가 화면 전체를 채우도록 확장되었습니다.</p>
      <p>이제 한글과 컴퓨터처럼 더 넓은 작업 공간을 경험해보세요.</p>
    `,
    editorProps: {
      attributes: {
        // min-h 설정으로 A4 용지 높이 확보
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[297mm]',
      },
    },
  })

  // 저장 로직 (제목은 MenuBar에서 관리할 수도 있지만, 여기선 심플하게 prompt 재사용하거나
  // 실제로는 MenuBar의 state를 끌어올려야 하나, 일단 동작 우선으로 구현)
  const saveDocument = async () => {
    if (!editor) return

    const contentJson = editor.getJSON() 
    
    // 편의상 저장 시 제목을 다시 물어보거나, 고정값 사용 (고도화 시 상태관리 필요)
    const title = window.prompt("저장할 문서 제목을 확인해주세요", "새 문서");
    if (!title) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/documents/', {
        title: title,
        content: contentJson 
      })

      if (response.status === 201) {
        alert("✅ 저장 완료!")
      }
    } catch (error) {
      alert("❌ 저장 실패")
      console.error(error)
    }
  }

  return (
    // pt-32: 헤더 높이만큼 상단 여백 확보 (중요!)
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 pt-32 pb-10">
      
      {/* 1. 메뉴바 (화면 전체 너비, 상단 고정) */}
      <MenuBar editor={editor} onSave={saveDocument} />

      {/* 2. 에디터 영역 (A4 용지 스타일) */}
      <div className="shadow-2xl border border-gray-300 bg-white">
        <EditorContent editor={editor} />
      </div>

    </div>
  )
}

export default TiptapEditor