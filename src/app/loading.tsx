export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin">
          <svg
            className="h-16 w-16 text-white"
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
        <p className="text-lg font-semibold animate-opacity animate-delay-500">
          正在加载，请稍候...
        </p>
      </div>
    </div>
  );
}
