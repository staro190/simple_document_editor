/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 한컴 스타일의 A4 용지 크기 정의 (필요시)
      width: {
        'a4': '210mm', 
      },
      height: {
        'a4': '297mm',
      },
      colors: {
        'hancom-blue': '#00a4e3', // 한컴 포인트 컬러 예시
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 에디터 내부 글자 스타일 자동화
  ],
}