// components/GlobalStyles.jsx

import { useCustomization } from "../context/CustomizationContext";

const GlobalStyles = () => {
  const { customization } = useCustomization();
  
  return (
    <style jsx global>{`
      :root {
        --font-body: ${customization.font_family}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-heading: ${customization.font_heading}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-size-base: ${customization.font_size_base};
      }
      
      body {
        font-family: var(--font-body);
        font-size: var(--font-size-base);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
      }
      
      // You can add more specific styling as needed
    `}</style>
  );
};

export default GlobalStyles;