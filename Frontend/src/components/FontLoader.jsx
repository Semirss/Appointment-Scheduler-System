// // components/FontLoader.jsx
// import { useEffect } from 'react';
// import { useCustomization } from '../context/CustomizationContext';

// const FontLoader = () => {
//   const { customization } = useCustomization();
  
//   useEffect(() => {
//     // Load body font
//     if (customization.font_family && !customization.font_family.startsWith('system')) {
//       const link = document.createElement('link');
//       link.href = `https://fonts.googleapis.com/css2?family=${customization.font_family.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
//       link.rel = 'stylesheet';
//       document.head.appendChild(link);
//     }
    
//     // Load heading font if different from body font
//     if (customization.font_heading && 
//         customization.font_heading !== customization.font_family &&
//         !customization.font_heading.startsWith('system')) {
//       const link = document.createElement('link');
//       link.href = `https://fonts.googleapis.com/css2?family=${customization.font_heading.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
//       link.rel = 'stylesheet';
//       document.head.appendChild(link);
//     }
//   }, [customization.font_family, customization.font_heading]);
  
//   return null;
// };

// export default FontLoader;