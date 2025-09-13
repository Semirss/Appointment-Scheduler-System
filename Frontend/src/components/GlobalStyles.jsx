// components/GlobalStyles.jsx
import React, { useEffect } from 'react';
import { useCustomization } from "../context/CustomizationContext";

const GlobalStyles = () => {
  const { customization } = useCustomization();

  useEffect(() => {
    // A more robust way to handle this:
    // dynamically add the link tags to the head inside useEffect
    // This ensures they are added when customization changes
    const links = [];

    // Load body font
    if (customization.font_family && !customization.font_family.startsWith('system')) {
      const bodyLink = document.createElement('link');
      bodyLink.href = `https://fonts.googleapis.com/css2?family=${customization.font_family.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
      bodyLink.rel = 'stylesheet';
      document.head.appendChild(bodyLink);
      links.push(bodyLink);
    }
    
    // Load heading font if different
    if (customization.font_heading && 
        customization.font_heading !== customization.font_family &&
        !customization.font_heading.startsWith('system')) {
      const headingLink = document.createElement('link');
      headingLink.href = `https://fonts.googleapis.com/css2?family=${customization.font_heading.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
      headingLink.rel = 'stylesheet';
      document.head.appendChild(headingLink);
      links.push(headingLink);
    }

    // Cleanup function to remove the added link tags
    return () => {
      links.forEach(link => link.remove());
    };
  }, [customization.font_family, customization.font_heading]);

  return (
    <style jsx global>{`
      :root {
        --font-body: ${customization.font_family}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-heading: ${customization.font_heading}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-size-base: ${customization.font_size_base};
        
        --theme-background: ${customization.theme_background};
        --theme-text: ${customization.theme_text};
        --theme-button: ${customization.theme_button};
        --theme-card: ${customization.theme_card};
        --sidebar-bg: ${customization.sidebar_bg};
        --sidebar-text: ${customization.sidebar_text};
        --header-bg: ${customization.header_bg};
        --header-text: ${customization.header_text};
      }
      
      body {
        font-family: var(--font-body);
        font-size: var(--font-size-base);
        background-color: var(--theme-background);
        color: var(--theme-text);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
      }
    `}</style>
  );
};

export default GlobalStyles;