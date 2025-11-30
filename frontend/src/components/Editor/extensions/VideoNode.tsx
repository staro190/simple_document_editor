import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
// 1. Tiptap에서 제공하는 타입(NodeViewProps)을 가져옵니다.
import type { NodeViewProps } from '@tiptap/core' 

// 2. 컴포넌트 props에 타입을 지정합니다. ({ node, updateAttributes }: NodeViewProps)
const VideoComponent = ({ node, updateAttributes }: NodeViewProps) => {
  return (
    <NodeViewWrapper className="my-4 relative group">
      <div className="relative border-2 border-transparent hover:border-gray-300 rounded transition-all">
        {/* node.attrs가 any가 아니게 되므로 안전하게 접근 가능합니다 */}
        <video
          src={node.attrs.src}
          width={node.attrs.width}
          controls={node.attrs.controls}
          autoPlay={node.attrs.autoplay}
          className="mx-auto"
        />
        
        <div className="absolute top-0 right-0 bg-black/70 text-white p-2 text-xs rounded m-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="font-bold mb-1">⚙️ Video Params</div>
          
          <label className="block">
            Width: 
            <input 
              type="range" min="300" max="800" 
              value={parseInt(node.attrs.width || '400')}
              onChange={(e) => updateAttributes({ width: e.target.value + 'px' })}
              className="ml-2 align-middle"
            />
          </label>

          <label className="block mt-1">
            <input 
              type="checkbox" 
              checked={node.attrs.autoplay}
              onChange={(e) => updateAttributes({ autoplay: e.target.checked })}
              className="mr-1"
            />
            Autoplay
          </label>
        </div>
      </div>
      
      {!node.attrs.src && (
        <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-300">
          <input 
            type="text" 
            placeholder="비디오 URL 입력 (mp4)..."
            className="border p-1 rounded w-full mb-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateAttributes({ src: e.currentTarget.value })
              }
            }}
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
            영상 업로드 (예정)
          </button>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export default Node.create({
  name: 'customVideo',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '100%' },
      controls: { default: true },
      autoplay: { default: false },
    }
  },

  parseHTML() {
    return [{ tag: 'custom-video' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['custom-video', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent)
  },
})