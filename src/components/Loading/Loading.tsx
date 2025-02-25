export default function LoadingComponent({
  isFullScreen = false,
}: {
  isFullScreen?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        isFullScreen ? "fixed inset-0 bg-gray-100/80 z-50" : "w-full h-full"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* 旋转加载动画 */}
        <div className="animate-spin">
          <svg
            className="h-10 w-10 dark:text-sky-300 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
          </svg>
        </div>
        {/* 加载文字 */}
        <p className="text-md font-medium text-gray-700">正在加载，请稍候...</p>
      </div>
    </div>
  );
}

export const revalidate = false;