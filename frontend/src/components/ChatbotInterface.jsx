import React, { useEffect } from 'react';

const ChatbotInterface = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Botpress script loaded successfully.");

      // Ensure `window.botpressWebChat` is defined
      if (window.botpressWebChat && typeof window.botpressWebChat.init === 'function') {
        window.botpressWebChat.init({
          botId: '20250310104148-QIDNFX39',
          host: 'https://cdn.botpress.cloud',
          configUrl: 'https://files.bpcontent.cloud/2025/03/10/10/20250310104148-84VVHEIF.json',
        });

        window.botpressWebChat.onEvent((event) => {
          if (event.type === 'text') {
            console.log("Bot response:", event.text);
          }
        });
      } else {
        console.error("window.botpressWebChat or window.botpressWebChat.init is not defined.");
      }
    };

    script.onerror = () => {
      console.error("Failed to load Botpress script.");
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ChatbotInterface;