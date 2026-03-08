

import useVoiceAnnouncer, { VoiceLanguage, languageNames } from '@/hooks/useVoiceAnnouncer';
import React, { useEffect, useState } from 'react';

interface VoiceAnnouncerProps {
  autoAnnounce?: boolean;        // 是否自动播报
  welcomeMessage?: string;       // 欢迎语
  language?: VoiceLanguage;      // 默认语言
  showControls?: boolean;        // 是否显示控制面板
  onPlay?: () => void;           // 播放回调
  onError?: (error: string) => void; // 错误回调
  className?: string;            // 自定义样式
}

const VoiceAnnouncer: React.FC<VoiceAnnouncerProps> = ({
  autoAnnounce = false,
  welcomeMessage = '歡迎光臨',
  language = 'zh-CN',
  showControls = true,
  onPlay,
  onError,
  className = ''
}) => {
  const {
    speak,
    setLanguage,
    getVoicesByLanguage,
    isSupported,
    isPlaying,
    currentVoice,
    debugMessage
  } = useVoiceAnnouncer();

  const [selectedLang, setSelectedLang] = useState<VoiceLanguage>(language);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [customText, setCustomText] = useState('');

  // 初始化设置语言
  useEffect(() => {
    setLanguage(selectedLang);
  }, [selectedLang, setLanguage]);

  // 获取可用语音
  useEffect(() => {
    const voices = getVoicesByLanguage(selectedLang);
    setAvailableVoices(voices);
  }, [selectedLang, getVoicesByLanguage]);

  // 自动播报
  useEffect(() => {
    if (autoAnnounce && isSupported) {
      const timer = setTimeout(() => {
        speak({
          lang: selectedLang,
          text: welcomeMessage,
          rate: 0.9
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoAnnounce, selectedLang, welcomeMessage, isSupported, speak]);

  // 处理播放
  const handlePlay = (text: string) => {
    if (!text.trim()) return;
    
    const success = speak({
      lang: selectedLang,
      text: text,
      rate: 0.9
    });

    if (success) {
      onPlay?.();
    }
  };

  // 处理错误
  useEffect(() => {
    if (debugMessage.includes('❌')) {
      onError?.(debugMessage);
    }
  }, [debugMessage, onError]);

  if (!isSupported) {
    return (
      <div className={`p-4 bg-yellow-100 text-yellow-800 rounded ${className}`}>
        ⚠️ 您的浏览器不支持语音合成功能
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 调试信息 */}
      {debugMessage && (
        <div className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded">
          {debugMessage}
        </div>
      )}

      {showControls && (
        <>
          {/* 语言选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">选择语言</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as VoiceLanguage)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              {Object.entries(languageNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label} {value}
                </option>
              ))}
            </select>
          </div>

          {/* 可用语音信息 */}
          {availableVoices.length > 0 && (
            <div className="text-xs text-gray-500">
              找到 {availableVoices.length} 个{languageNames[selectedLang]}语音
            </div>
          )}

          {/* 当前语音 */}
          {currentVoice && (
            <div className="text-xs text-gray-500">
              当前语音: {currentVoice.name} ({currentVoice.lang})
            </div>
          )}

          {/* 预设快捷短语 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">快捷短语</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePlay('你好，歡迎光臨')}
                disabled={isPlaying}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                欢迎语
              </button>
              <button
                onClick={() => handlePlay('您有新消息')}
                disabled={isPlaying}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                新消息
              </button>
              <button
                onClick={() => handlePlay('天氣不錯')}
                disabled={isPlaying}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50"
              >
                天气
              </button>
              <button
                onClick={() => handlePlay('再見')}
                disabled={isPlaying}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
              >
                再见
              </button>
            </div>
          </div>

          {/* 自定义文本输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">自定义文本</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="输入要播报的文字"
                className="flex-1 p-2 border rounded bg-white dark:bg-gray-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customText.trim()) {
                    handlePlay(customText);
                  }
                }}
              />
              <button
                onClick={() => handlePlay(customText)}
                disabled={!customText.trim() || isPlaying}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                播放
              </button>
            </div>
          </div>
        </>
      )}

      {/* 播放状态指示器 */}
      {isPlaying && (
        <div className="flex items-center space-x-2 text-blue-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <span className="text-sm">正在播放...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAnnouncer;