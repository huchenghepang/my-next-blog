import DownArrowWrapper from "../HotArticle/DownArrowWrapper"

interface Props {
  text: string
}

const SideTitle = ({text}: Props) => {
  return (
    <div className="flex justify-center items-center group">
      <span
        className="
        text-2xl
        sm:text-3xl 
        md:text-4xl
        lg:text-5xl 
        font-black 
        mr-1
        sm:mr-2 
        bg-gradient-to-r 
        from-amber-500 
        via-orange-500 
        to-red-500 
        bg-clip-text 
        text-transparent
        [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]
        sm:[text-shadow:_2px_2px_4px_rgb(0_0_0_/_30%)]
        tracking-wider
        relative
        after:content-['']
        after:absolute
        after:bottom-[-2px]
        sm:after:bottom-[-4px]
        after:left-0
        after:w-0
        after:h-[2px]
        sm:after:h-[3px]
        after:bg-gradient-to-r
        after:from-amber-500
        after:to-red-500
        after:transition-all
        after:duration-300
        group-hover:after:w-full
        whitespace-nowrap
      "
      >
        {text}
      </span>
      <div className="scale-75 sm:scale-100">
        <DownArrowWrapper idTarget="step-second-life" block="end" />
      </div>
    </div>
  )
}

export default SideTitle
