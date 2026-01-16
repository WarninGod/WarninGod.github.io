// Config file for sensitive/environment-specific values
// This file should be imported but the values should come from environment variables in production
// Create a .env file locally and use a build process to inject these values

const CONFIG = {
    // Formspree Form ID - set via environment variable VITE_FORMSPREE_ID or REACT_APP_FORMSPREE_ID
    // Example in .env: VITE_FORMSPREE_ID=xreggnre
    FORMSPREE_ID: import.meta.env.VITE_FORMSPREE_ID || 'xreggnre',
    
    // Spline 3D Scene URL - can also be configured
    SPLINE_SCENE_URL: import.meta.env.VITE_SPLINE_SCENE_URL || 'https://prod.spline.design/sDlGmCG7iCh35Up8/scene.splinecode',
};

// For non-Vite/build-tool environments, use window variable injection:
// If using plain HTML/JS without a build step, add this to your deployment process:
// window.CONFIG = { FORMSPREE_ID: 'your-id-from-env' }

// Fallback if neither environment variable nor window.CONFIG is available
if (typeof window.CONFIG === 'undefined') {
    window.CONFIG = CONFIG;
}
