/**
 * 홈페이지
 * SSG 대상 페이지 - 초기 HTML에 텍스트 포함
 */

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">Project Base에 오신 것을 환영합니다</h1>
      <p className="text-1rem text-gray-600 mb-8">
        이 텍스트는 초기 HTML에 포함되어 SEO와 애드센스 크롤링에 최적화되어 있습니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">첫 번째 섹션</h2>
          <p className="text-1rem text-gray-600">
            이 콘텐츠는 서버 사이드 렌더링을 통해 초기 HTML에 포함됩니다.
          </p>
        </article>
        <article className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">두 번째 섹션</h2>
          <p className="text-1rem text-gray-600">
            검색 엔진과 크롤러가 이 텍스트를 쉽게 읽을 수 있습니다.
          </p>
        </article>
      </div>
    </div>
  );
}
