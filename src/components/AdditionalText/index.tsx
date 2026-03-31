import {FC} from "react"
import additionalTextStyle from "./additional-text.module.scss"

type Quote = {
  author: string
  text: string
  english: string
}
interface AdditionalTextProps {
  quote?: Quote
}
const quotes = [
  {
    author: "村上春树",
    text: "当你年轻时，以为一切都来得及。当你年老时，才发现一切都已过去。",
    english:
      "When you're young, you think everything is possible. When you're old, you realize everything has passed.",
  },
  {
    author: "加缪",
    text: "人与其生活的离异，演员与其布景的分离，正是荒谬感。",
    english:
      "The divorce between man and his life, the actor and his setting, is properly the feeling of absurdity.",
  },
  {
    author: "尼采",
    text: "没有音乐的生命是一种错误。",
    english: "Without music, life would be a mistake.",
  },
  {
    author: "康德",
    text: "世界上有两件东西能够深深地震撼人们的心灵，一件是我们心中崇高的道德准则，另一件是我们头顶上灿烂的星空。",
    english:
      "Two things fill the mind with ever new and increasing admiration and awe: the starry heavens above me and the moral law within me.",
  },
  {
    author: "王安石",
    text: "看似寻常最奇崛，成如容易却艰辛。",
    english:
      "What seems ordinary is often the most extraordinary; what appears easy is achieved through great hardship.",
  },
]

const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}

const AdditionalText: FC<AdditionalTextProps> = ({quote}) => {
  const quoteInfo = quote || getRandomQuote()

  return (
    <div className={additionalTextStyle["additional-text-Container"]}>
      <div className={additionalTextStyle["quote-icon"]}>“</div>
      <p className={additionalTextStyle["quote-text"]}>{quoteInfo.text}</p>
      <p className={additionalTextStyle["quote-english"]}>
        {quoteInfo.english}
      </p>
      <div className={additionalTextStyle["quote-author"]}>
        —— {quoteInfo.author}
      </div>

      {/* 右下角创意元素 - 旋转的几何图形 */}
      <div className={additionalTextStyle["creative-corner-element"]}>
        <div className={additionalTextStyle["rotating-circle"]}></div>
        <div className={additionalTextStyle["floating-particle"]}></div>
        <div className={additionalTextStyle["geometric-shape"]}></div>
      </div>
    </div>
  )
}

export default AdditionalText
