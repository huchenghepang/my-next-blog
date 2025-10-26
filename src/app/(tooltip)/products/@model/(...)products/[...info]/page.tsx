"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ info: string[] }>; // 还是 Promise 类型
}

export default function Page({ params }: PageProps) {
  const router = useRouter(); // ✅ 现在可以用 useRouter()
  const [info, setInfo] = useState<string[]>([]);

  // 解决 Promise params 的问题
  useEffect(() => {
    params.then((data) => setInfo(data.info)).catch(console.error);
  }, [params]);

  const closeModal = () => router.back();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 pointer-events-auto"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full pointer-events-auto">
        <h2 className="text-2xl font-bold mb-4">模态框</h2>
        {info.length > 0 ? (
          <>
            <p className="text-gray-800 mb-2">ID: {info[0]}</p>
            <p className="text-gray-800">Brand: {info[1]}</p>
          </>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
