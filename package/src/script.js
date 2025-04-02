export function getLottieScript(options = {}) {
	const {
		autoplay = true,
		loop = true,
		useHoverControls = false,
		containerPrefix = "lottie-container-",
		hoverPrefix = "lottie-hover-",
	} = options;

	return `
(function() {
  // Prevent multiple initializations
  if (window.dotLottieInitialized) return;
  window.dotLottieInitialized = true;
  
  const SHARED_WORKER_ID = "shared-dotlottie-worker";
  
  const toKebabCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\\s_]+/g, '-')
      .toLowerCase();
  };
  
  // Store all animation instances
  window.lottieInstances = {};
  
  // Initialize a lottie animation
  window.loadLottie = (name, animationOptions = {}) => {
    const {
      autoplay: shouldAutoplay = ${autoplay},
      loop: shouldLoop = ${loop},
      useHoverControls: shouldUseHoverControls = ${useHoverControls},
      containerPrefix: prefix = '${containerPrefix}',
      hoverPrefix: hoverPrefixOverride = '${hoverPrefix}'
    } = animationOptions;
    
    // Clean up any existing instance
    if (window.lottieInstances[name]) {
      window.lottieInstances[name].destroy();
    }
    
    // Get a sanitized animation name in kebab-case
    const animationName = toKebabCase(name);
    
    const canvasElement = document.getElementById(\`\${prefix}\${animationName}\`);
    if (!canvasElement) {
      console.error(\`Canvas element with ID "\${prefix}\${animationName}" not found\`);
      return null;
    }
    
    const lottie = new DotLottieWorker({
      canvas: canvasElement,
      src: \`/animations/\${animationName}.lottie\`,
      loop: shouldLoop,
      autoplay: shouldAutoplay,
      workerId: SHARED_WORKER_ID
    });
    
    window.lottieInstances[animationName] = lottie;
    
    if (shouldUseHoverControls) {
      const hoverElement = document.getElementById(\`\${hoverPrefixOverride}\${animationName}\`);
      if (hoverElement) {
        hoverElement.addEventListener("mouseenter", () => {
          lottie.play();
        });
        
        hoverElement.addEventListener("mouseleave", () => {
          lottie.pause();
        });
      }
    }
    
    return lottie;
  };
  
  // Initialize all lottie elements on the page
  window.initAllLotties = () => {
    document.querySelectorAll('[data-lottie-name]').forEach(element => {
      const name = element.getAttribute('data-lottie-name');
      const autoplay = element.getAttribute('data-lottie-autoplay') !== 'false';
      const loop = element.getAttribute('data-lottie-loop') !== 'false';
      const useHoverControls = element.getAttribute('data-lottie-hover-controls') === 'true';
      
      if (name) {
        window.loadLottie(name, { autoplay, loop, useHoverControls });
      }
    });
  };
  
  // Initialize on DOM content loaded
  document.addEventListener('DOMContentLoaded', window.initAllLotties);
  
  // Clean up all instances when the page is unloaded
  window.addEventListener('beforeunload', () => {
    Object.values(window.lottieInstances).forEach(instance => {
      try {
        instance.destroy();
      } catch (e) {
        console.error('Error destroying lottie instance:', e);
      }
    });
    window.lottieInstances = {};
  });
})();
  `;
}
