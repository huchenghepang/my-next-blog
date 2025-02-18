export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 头部横幅 */}
      <header className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">欢迎来到我的博客</h1>
        <p className="text-lg mt-4">分享技术、生活与思考</p>
      </header>

      {/* 热门文章 */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">热门文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
            
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  文章标题 {item}
                </h3>
                <p className="text-gray-600 mt-2">文章的简要描述...</p>
                <a
                  href="#"
                  className="text-blue-500 mt-4 inline-block hover:underline"
                >
                  阅读更多 →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 分类导航 */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">分类导航</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {["前端", "后端", "数据库", "随笔", "Vue", "React"].map(
              (category) => (
                <a
                  key={category}
                  href="#"
                  className="bg-gray-200 hover:bg-blue-500 hover:text-white px-6 py-2 rounded-full transition"
                >
                  {category}
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* 关于作者 */}
      <section className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">关于我</h2>
        <div className="mt-6 flex flex-col items-center">
        
          <p className="text-gray-600 mt-4 max-w-lg">
            你好，我是一名前端开发者，热衷于技术分享和博客创作，希望你能在这里找到有用的内容！
          </p>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Jeff的博客. 版权所有</p>
      </footer>
    </div>
  );
}
