import { ReactNode } from 'react';

interface ImageCenterTextProps {
  backgroundImage: string;
  darkBackgroundImage?: string;
  title: string;
  subtitle: string;
  description: string;
  children?: ReactNode;
}

const ImageCenterText = ({
  backgroundImage,
  darkBackgroundImage,
  title,
  subtitle,
  description,
  children
}: ImageCenterTextProps) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl shadow-xl">
      {/* 背景图片 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
          darkBackgroundImage 
            ? 'dark:bg-[url("' + darkBackgroundImage + '")] bg-[url("' + backgroundImage + '")]'
            : 'bg-[url("' + backgroundImage + '")]'
        }`}
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      
      {/* 渐变遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 dark:from-black/70 dark:to-black/40"></div>
      
      {/* 中央内容区域 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-6">
        <div className="text-center max-w-3xl w-full space-y-6 animate-fade-in">
          {/* 主标题 */}
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            {title}
          </h2>
          
          {/* 副标题 */}
          <h3 className="text-2xl md:text-3xl font-light text-sky-200 tracking-wider drop-shadow-md">
            {subtitle}
          </h3>
          
          {/* 描述文字 */}
          <p className="text-lg text-white font-light leading-relaxed tracking-wide drop-shadow-md">
            {description}
          </p>
          
          {/* 自定义内容区域 */}
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCenterText;