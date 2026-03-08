// hooks/useVoiceAnnouncer.ts
import { useCallback, useEffect, useState } from 'react';

// 语言类型
export type VoiceLanguage = 'zh-CN' | 'zh-HK' | 'en-US' | 'zh-TW';

// 语音配置接口
export interface VoiceConfig {
  lang: VoiceLanguage;
  rate?: number;
  pitch?: number;
  volume?: number;
  text: string;
}

// 语言对应的显示名称
export const languageNames: Record<VoiceLanguage, string> = {
'zh-CN': '普通话',
'zh-HK': '香港（粵語）',
'en-US': 'English',
'zh-TW': '正體中文'
};

const useVoiceAnnouncer = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');

  // 初始化：检查浏览器支持并加载语音
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
    
    if (!supported) {
      setDebugMessage('❌ 浏览器不支持语音合成');
      return;
    }

    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('可用语音:', availableVoices);
        
      setVoices(availableVoices);
      setDebugMessage(`✅ 已加载 ${availableVoices.length} 个语音`);
      
      // 默认选择第一个语音
      if (availableVoices.length > 0 && !currentVoice) {
        setCurrentVoice(availableVoices[0]);
      }
    };

    loadVoices();

    // Chrome 需要这个事件
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // 组件卸载时停止播放
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 根据语言获取最合适的语音
  const getVoiceForLanguage = useCallback((lang: VoiceLanguage): SpeechSynthesisVoice | null => {
    // 语言代码映射
    const langMap: Record<VoiceLanguage, string[]> = {
      'zh-CN': ['zh-CN', 'zh', 'cmn'],
      'zh-HK': ['zh-HK', 'yue', 'zh-Hant-HK'],
        'en-US': ['en-US', 'en'],
        'zh-TW': ['zh-TW', 'zh-Hant-TW']
    };

    const targetLangs = langMap[lang];

    for (const targetLang of targetLangs) {
      const exactMatch = voices.find(v => 
        v.lang.toLowerCase() === targetLang.toLowerCase()
      );
      if (exactMatch) return exactMatch;
    }

    // 其次查找包含语言代码的语音
    for (const targetLang of targetLangs) {
      const partialMatch = voices.find(v => 
        v.lang.toLowerCase().includes(targetLang.toLowerCase())
      );
      if (partialMatch) return partialMatch;
    }

    // 查找名称中包含关键词的语音（特别处理粤语）
    if (lang === 'zh-HK') {
      const cantoneseVoice = voices.find(v => 
        v.name.includes('Cantonese') || 
        v.name.includes('廣東話') || 
        v.name.includes('粤语')
      );
      if (cantoneseVoice) return cantoneseVoice;
    }

    // 最后返回第一个可用语音
    return voices.length > 0 ? voices[0] : null;
  }, [voices]);

  // 设置语音
  const setLanguage = useCallback((lang: VoiceLanguage) => {
    const voice = getVoiceForLanguage(lang);
    if (voice) {
      setCurrentVoice(voice);
      setDebugMessage(`✅ 已切换到: ${voice.name} (${voice.lang})`);
    } else {
      setDebugMessage(`⚠️ 未找到 ${lang} 的语音`);
    }
    return voice;
  }, [getVoiceForLanguage]);

  // 播放语音
  const speak = useCallback((config: VoiceConfig | string) => {
    if (!isSupported) {
      console.warn('浏览器不支持语音合成');
      return false;
    }

    // 停止当前播放
    window.speechSynthesis.cancel();

    // 解析配置
    const text = typeof config === 'string' ? config : config.text;
    const lang = typeof config === 'string' ? 'zh-CN' : config.lang;
    const rate = typeof config === 'string' ? 1 : config.rate ?? 1;
    const pitch = typeof config === 'string' ? 1 : config.pitch ?? 1;
    const volume = typeof config === 'string' ? 1 : config.volume ?? 1;

    const utterance = new SpeechSynthesisUtterance(text);

    // 获取对应语言的语音
    let targetVoice = currentVoice;
    
    // 如果指定了语言，尝试获取对应的语音
    if (typeof config !== 'string' && config.lang) {
      const langVoice = getVoiceForLanguage(config.lang);
      if (langVoice) {
        targetVoice = langVoice;
      } else {
        // 如果没有找到对应语音，设置语言代码
        utterance.lang = config.lang;
      }
    }

    // 设置语音（如果找到了）
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    // 设置其他参数
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // 事件监听
    utterance.onstart = () => {
      setIsPlaying(true);
      setDebugMessage(`🔊 播放中: ${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setDebugMessage('✅ 播放完成');
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setDebugMessage(`❌ 播放错误: ${event.error}`);
      console.error('语音播放错误:', event);
    };

    // 开始播放
    try {
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('语音播放异常:', error);
      setDebugMessage(`❌ 播放异常: ${error}`);
      return false;
    }
  }, [isSupported, currentVoice, getVoiceForLanguage]);

  // 获取指定语言的所有可用语音
  const getVoicesByLanguage = useCallback((lang: VoiceLanguage) => {
    const langMap: Record<VoiceLanguage, string[]> = {
      'zh-CN': ['zh-CN', 'zh', 'cmn'],
      'zh-HK': ['zh-HK', 'yue', 'zh-Hant-HK'],
        'en-US': ['en-US', 'en'],
        'zh-TW': ['zh-TW', 'zh-Hant-TW']
    };

    const targetLangs = langMap[lang];
    
    return voices.filter(voice => 
      targetLangs.some(l => 
        voice.lang.toLowerCase().includes(l.toLowerCase()) ||
        (lang === 'zh-HK' && (
          voice.name.includes('Cantonese') || 
          voice.name.includes('廣東話') || 
          voice.name.includes('粤语')
        ))
      )
    );
  }, [voices]);

  return {
    speak,
    setLanguage,
    getVoicesByLanguage,
    isSupported,
    isPlaying,
    voices,
    currentVoice,
    debugMessage
  };
};

export default useVoiceAnnouncer;