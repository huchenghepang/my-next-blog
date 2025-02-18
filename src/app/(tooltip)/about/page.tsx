export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 dark:text-white rounded-lg shadow-lg transition-all">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          关于我
        </h1>
        <h3 className="text-2xl text-gray-500 dark:text-gray-300">
          选择独自朝圣
        </h3>
      </header>

      {/* Content */}
      <section className="space-y-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          你好，我是黄祥坤，网名叫护城河，英文名是Jeff。关于我为什么叫这个姓名？答：前两个字是祖上给的，第三个字据说是我大伯从新华字典上找的。貌似拿这个最后一句也有点深意，能和五行能搭得上点边。但我一直不太喜欢这个姓名，因为这个三个字的HXK首字母，打出来总是好辛苦。每每如此我就想想，可能我的人生将也看得辛苦。
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          至于网名叫护城河，源于看了一本书，一本挺庸俗的书。书中描绘了一座城，它说象征着晶莹剔透的爱情，但是漂浮在空中，而人只能站在地上的护城河旁，却也不懂得珍惜。这个网名起的很早，初中就是这个名字，到如今我也从来没有改过，对于这一点我一直挺骄傲的。而到现在，我觉得这名字也挺不错的，因为一定程度上它警醒着我，要在自己的人生路上去找到自己的护城河。
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          他字介甫。恰巧碰到要注册Google的邮箱就取了Jeff这个英文名。哦对，其实还有Smith这个英文的姓，这个姓就不知道为什么取了，可能是因为九年义务教育，它出现的频率高吧。
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          关于我的过去，我大概率讲不出些什么。真要讲，我感觉很不幸运的生活在了后浪的时代，既没有赶上二次工业革命，也没选对专业。
          “不幸运”成了一头没有站在“风口上的猪”，所以到现在也没有飞起来。真是命途多舛啊。但这么多年都活过来了，我想我要做的就是继续舔着脸，耐着性子好好活下去了。
        </p>
      </section>

      {/* Contact Info */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          网络信息：
        </h2>
        <ul className="list-inside space-y-2">
          <li className="text-lg">
            QQ邮箱：{" "}
            <a
              href="mailto:2927678784@qq.com"
              className="text-orange-500 hover:underline dark:text-orange-400"
            >
              2927678784@qq.com
            </a>
          </li>
          <li className="text-lg">
            工作邮箱：{" "}
            <a
              href="mailto:huchenghe1021@outlook.com"
              className="text-orange-500 hover:underline dark:text-orange-400"
            >
              huchenghe1021@outlook.com
            </a>
          </li>
          <li className="text-lg">
            GitHub地址：{" "}
            <a
              href="https://github.com/huchenghepang"
              className="text-orange-500 hover:underline dark:text-orange-400"
            >
              https://github.com/huchenghepang
            </a>
          </li>
        </ul>
      </section>

      {/* Motto */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          座右铭：
        </h2>
        <p className="italic text-lg text-gray-600 dark:text-gray-300">
          如果你相信你能得到什么，那么你将什么都得不到
        </p>
      </section>

      {/* Favorite Quotes */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          喜欢的话：
        </h2>
        <p className="italic text-lg text-gray-600 dark:text-gray-300">
          贪婪好，茫然忘了邯郸道
        </p>
      </section>

      {/* Hobbies */}
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          喜欢的事情：
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          以下是我喜欢的一些事情，这真的可以证明我生活在一个幸福的时代。
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2">
          <li>喜欢这个世界虚伪的样子，它让我被感觉好像大有作为。</li>
          <li>喜欢那些处处为人着想的“制度”和“政策”，它让我被感觉未来可期。</li>
          <li>
            喜欢这个特殊的互联网，让我从来都不需要意识到我还需要自己去动去思考。
          </li>
        </ul>
      </section>
    </div>
  );
}
