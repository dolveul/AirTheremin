/**
 * [확장 예시] Vite SSR 설정
 *
 * 이 템플릿의 기본은 CSR입니다. SSR로 확장할 때만 참고하는 설정 예시입니다.
 * - 기본 빌드/개발에는 사용하지 않습니다.
 * - 실제 SSR 구현 시 별도 엔트리·서버 설정이 필요합니다.
 *
 * 포지셔닝: docs/SSR_AND_SEO.md
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    // SSG를 위한 정적 페이지 생성 설정
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  ssr: {
    // SSR을 위한 설정
    noExternal: ['react', 'react-dom', 'react-router-dom'],
  },
})

