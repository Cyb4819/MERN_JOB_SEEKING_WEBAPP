import React, { useEffect } from 'react';

const ChatbotInterface = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3/inject.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Botpress script loaded successfully.");

      // Ensure `window.botpressWebChat` is defined
      if (window.botpressWebChat && typeof window.botpressWebChat.init === 'function') {
        window.botpressWebChat.init({
          host: 'https://cdn.botpress.cloud',
          configUrl: 'https://files.bpcontent.cloud/2025/10/14/19/20251014190530-4IGRTN2V.json',
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