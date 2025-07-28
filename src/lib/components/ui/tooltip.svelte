<!-- Tooltip.svelte -->
<script>
  export let text = '';
  export let position = 'top'; // 'top', 'bottom', 'left', 'right'
  export let delay = 500; // milliseconds
  export let theme = 'dark'; // 'dark', 'light'
  export let disabled = false;
  export let onshow = () => {}; // callback for when tooltip shows
  export let onhide = () => {}; // callback for when tooltip hides
  
  let visible = false;
  /**
	 * @type {number | undefined}
	 */
  let timeoutId;
  let tooltipElement;
  let triggerElement;
  
  function showTooltip() {
    if (disabled) return;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      visible = true;
      onshow();
    }, delay);
  }
  
  function hideTooltip() {
    clearTimeout(timeoutId);
    visible = false;
    onhide();
  }
  
  /**
	 * @param {{ key: string; }} event
	 */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      hideTooltip();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="tooltip-container"
  bind:this={triggerElement}
  on:mouseenter={showTooltip}
  on:mouseleave={hideTooltip}
  on:focus={showTooltip}
  on:blur={hideTooltip}
  role="button"
  tabindex="0"
>
  <!-- Slot for the trigger element -->
  <slot />
  
  <!-- Tooltip -->
  {#if visible && text}
    <div
      bind:this={tooltipElement}
      class="tooltip tooltip--{position} tooltip--{theme}"
      role="tooltip"
      aria-live="polite"
    >
      {text}
      <div class="tooltip-arrow tooltip-arrow--{position}"></div>
    </div>
  {/if}
</div>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }
  
  .tooltip {
    position: absolute;
    z-index: 1000;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    max-width: 300px;
    word-wrap: break-word;
    white-space: normal;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.2s ease, transform 0.2s ease;
    animation: tooltipFadeIn 0.2s ease forwards;
  }
  
  .tooltip--dark {
    background-color: #333;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .tooltip--light {
    background-color: white;
    color: #333;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Positioning */
  .tooltip--top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px) scale(0.8);
    margin-bottom: 5px;
  }
  
  .tooltip--bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px) scale(0.8);
    margin-top: 5px;
  }
  
  .tooltip--left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(-8px) scale(0.8);
    margin-right: 5px;
  }
  
  .tooltip--right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(8px) scale(0.8);
    margin-left: 5px;
  }
  
  /* Arrows */
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
  }
  
  .tooltip-arrow--top {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  
  .tooltip--dark .tooltip-arrow--top {
    border-top: 6px solid #333;
  }
  
  .tooltip--light .tooltip-arrow--top {
    border-top: 6px solid white;
  }
  
  .tooltip-arrow--bottom {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  
  .tooltip--dark .tooltip-arrow--bottom {
    border-bottom: 6px solid #333;
  }
  
  .tooltip--light .tooltip-arrow--bottom {
    border-bottom: 6px solid white;
  }
  
  .tooltip-arrow--left {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  
  .tooltip--dark .tooltip-arrow--left {
    border-left: 6px solid #333;
  }
  
  .tooltip--light .tooltip-arrow--left {
    border-left: 6px solid white;
  }
  
  .tooltip-arrow--right {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  
  .tooltip--dark .tooltip-arrow--right {
    border-right: 6px solid #333;
  }
  
  .tooltip--light .tooltip-arrow--right {
    border-right: 6px solid white;
  }
  
  /* Animation */
  @keyframes tooltipFadeIn {
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px) scale(1);
    }
  }
  
  .tooltip--top {
    animation: tooltipFadeInTop 0.2s ease forwards;
  }
  
  .tooltip--bottom {
    animation: tooltipFadeInBottom 0.2s ease forwards;
  }
  
  .tooltip--left {
    animation: tooltipFadeInLeft 0.2s ease forwards;
  }
  
  .tooltip--right {
    animation: tooltipFadeInRight 0.2s ease forwards;
  }
  
  @keyframes tooltipFadeInTop {
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px) scale(1);
    }
  }
  
  @keyframes tooltipFadeInBottom {
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(8px) scale(1);
    }
  }
  
  @keyframes tooltipFadeInLeft {
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(-8px) scale(1);
    }
  }
  
  @keyframes tooltipFadeInRight {
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(8px) scale(1);
    }
  }
  
  /* Responsive behavior */
  @media (max-width: 768px) {
    .tooltip {
      max-width: 250px;
      font-size: 13px;
    }
  }
</style>