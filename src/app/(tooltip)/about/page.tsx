export default function About() {
  return (
    <div className="w-1/2 mx-auto">
      <header className="mb-2 mt-6 justify-between flex  items-center">
        <h1 className="text-4xl font-bold">关于自我</h1>
        <h3 className="text-2xl ">选择独自朝圣</h3>
      </header>
      <section className="mb-2">
        <p className="mb-2 ">
          你好，我是黄祥坤，网名叫护城河，英文名是Jeff。关于我为什么叫这个姓名？答：前两个字是祖上给的，第三个字据说是我大伯从新华字典上找的。貌似拿这个最后一句也有点深意，能和五行能搭得上点边。但我一直不太喜欢这个姓名，因为这个三个字的HXK首字母，打出来总是好辛苦。每每如此我就想想，可能我的人生将也看得辛苦。
        </p>
        <p className="mb-2">
          至于网名叫护城河，源于看了一本书，一本挺庸俗的书。书中描绘了一座城，它说象征着晶莹剔透的爱情，但是漂浮在空中，而人只能站在地上的护城河旁，却也不懂得珍惜。这个网名起的很早，初中就是这个名字，到如今我也从来没有改过，对于这一点我一直挺骄傲的。而到现在，我觉得这名字也挺不错的，因为一定程度上它警醒着我，要在自己的人生路上去找到自己的护城河。
        </p>
        <p className="mb-2">
          英文名的来源也挺简单的，主要早年特别喜欢这些历史，特别喜欢变法的王安石。他字介甫。恰巧碰到要注册Google的邮箱就取了Jeff这个英文名，哦对，其实还有Smith这个英文的姓，这个姓就不知道为什么取了，可能是因为九年义务教育，它出现的频率高吧。
        </p>
        <p className="mb-2">
          关于我的过去，我大概率讲不出些什么。真要讲，我感觉很不幸运的生活在了后浪的时代，既没有赶上二次工业革命，也没选对专业。“不幸运”成了一头没有站在“风口上的猪”，所以到现在也没有飞起来。真是命途多舛啊。但这么多年都活过来了，我想我要做的就是继续舔着脸，耐着性子好好活下去了。
        </p>
      </section>
      <section className="mb-2">
        <h2 className="text-2xl font-semibold  mb-4">网络信息：</h2>
        <ul className="list-disc list-inside ">
          <li>
            QQ邮箱：
            <a
              href="mailto:2927678784@qq.com"
              className="text-orange-400 hover:underline"
            >
              2927678784@qq.com
            </a>
          </li>
          <li>
            工作邮箱：
            <a
              href="mailto:huchenghe1021@outlook.com"
              className="text-orange-400 hover:underline"
            >
              huchenghe1021@outlook.com
            </a>
          </li>
          <li>
            GitHub地址：
            <a
              href="https://github.com/huchenghepang"
              className="text-orange-400 hover:underline"
            >
              https://github.com/huchenghepang
            </a>
          </li>
        </ul>
      </section>
      <section className="mb-2">
        <h2 className="text-2xl font-semibold  mb-2">座右铭：</h2>
        <p className=" italic">如果你相信你能得到什么，那么你将什么都得不到</p>
      </section>
      <section className="mb-2">
        <h2 className="text-2xl font-semibold  mb-2">喜欢的话：</h2>
        <p className=" italic">贪婪好，茫然忘了邯郸道</p>
      </section>
      <section className="mb-2">
        <h2 className="text-2xl font-semibold  mb-2">喜欢的事情：</h2>
        <p className="mb-4 ">
          以下是我喜欢的一些事情，这真的可以证明我生活在一个幸福的时代。
        </p>
        <ul className="list-disc list-inside ">
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
