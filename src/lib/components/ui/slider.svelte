<script lang="ts">
  export let ref: HTMLDivElement | null = null;
  export let value: number[] = [50];
  export let orientation: "horizontal" | "vertical" = "horizontal";
  export let max: number = 100;
  export let min: number = 0;
  export let step: number = 1;
  export let className: string = "";
  export let type: "single" | "multiple" = "single";
  export let disabled = false;
  export let restProps: Record<string, any> = {};

  let isDragging = false;
  let dragIndex = -1;
  let trackElement: HTMLDivElement;

  // Ensure we have the right number of values
  $: {
    if (type === "single" && value.length !== 1) {
      value = [value[0] || 50];
    } else if (type === "multiple" && value.length !== 2) {
      value = value.length === 0 ? [25, 75] : 
             value.length === 1 ? [value[0], Math.min(value[0] + 25, max)] :
             [value[0], value[1]];
    }
  }

  function updateValue(clientX: number, clientY: number, thumbIndex: number) {
    if (!trackElement || disabled) return;

    const rect = trackElement.getBoundingClientRect();
    let percentage: number;

    if (orientation === "horizontal") {
      percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    } else {
      percentage = Math.max(0, Math.min(100, (1 - (clientY - rect.top) / rect.height) * 100));
    }

    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (type === "single") {
      value = [clampedValue];
    } else {
      const newValues = [...value];
      newValues[thumbIndex] = clampedValue;
      
      // Ensure values don't cross over
      if (thumbIndex === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (thumbIndex === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0];
      }
      
      value = newValues;
    }
  }

  function handleMouseDown(event: MouseEvent) {
    if (disabled) return;
    
    // Determine which thumb to move for range sliders
    if (type === "multiple") {
      const rect = trackElement.getBoundingClientRect();
      const clickPercentage = orientation === "horizontal" 
        ? ((event.clientX - rect.left) / rect.width) * 100
        : (1 - (event.clientY - rect.top) / rect.height) * 100;
      
      const val1Percentage = ((value[0] - min) / (max - min)) * 100;
      const val2Percentage = ((value[1] - min) / (max - min)) * 100;
      
      // Move the closest thumb
      dragIndex = Math.abs(clickPercentage - val1Percentage) <= Math.abs(clickPercentage - val2Percentage) ? 0 : 1;
    } else {
      dragIndex = 0;
    }
    
    isDragging = true;
    updateValue(event.clientX, event.clientY, dragIndex);
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      updateValue(event.clientX, event.clientY, dragIndex);
    };

    const handleMouseUp = () => {
      isDragging = false;
      dragIndex = -1;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    event.preventDefault();
  }

  function handleThumbMouseDown(event: MouseEvent, thumbIndex: number) {
    if (disabled) return;
    isDragging = true;
    dragIndex = thumbIndex;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      updateValue(event.clientX, event.clientY, dragIndex);
    };

    const handleMouseUp = () => {
      isDragging = false;
      dragIndex = -1;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    event.preventDefault();
    event.stopPropagation();
  }

  function handleTouchStart(event: TouchEvent) {
    if (disabled) return;
    isDragging = true;
    const touch = event.touches[0];
    
    if (type === "multiple") {
      const rect = trackElement.getBoundingClientRect();
      const touchPercentage = orientation === "horizontal" 
        ? ((touch.clientX - rect.left) / rect.width) * 100
        : (1 - (touch.clientY - rect.top) / rect.height) * 100;
      
      const val1Percentage = ((value[0] - min) / (max - min)) * 100;
      const val2Percentage = ((value[1] - min) / (max - min)) * 100;
      
      dragIndex = Math.abs(touchPercentage - val1Percentage) <= Math.abs(touchPercentage - val2Percentage) ? 0 : 1;
    } else {
      dragIndex = 0;
    }
    
    updateValue(touch.clientX, touch.clientY, dragIndex);
    event.preventDefault();
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDragging) return;
    const touch = event.touches[0];
    updateValue(touch.clientX, touch.clientY, dragIndex);
    event.preventDefault();
  }

  function handleTouchEnd() {
    isDragging = false;
    dragIndex = -1;
  }

  function handleKeyDown(event: KeyboardEvent, thumbIndex: number) {
    if (disabled) return;
    
    let delta = 0;
    const currentValue = value[thumbIndex];
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'Home':
        if (type === "single") {
          value = [min];
        } else {
          const newValues = [...value];
          newValues[thumbIndex] = min;
          if (thumbIndex === 0 && newValues[0] > newValues[1]) {
            newValues[0] = newValues[1];
          }
          value = newValues;
        }
        return;
      case 'End':
        if (type === "single") {
          value = [max];
        } else {
          const newValues = [...value];
          newValues[thumbIndex] = max;
          if (thumbIndex === 1 && newValues[1] < newValues[0]) {
            newValues[1] = newValues[0];
          }
          value = newValues;
        }
        return;
      default:
        return;
    }
    
    event.preventDefault();
    
    if (type === "single") {
      const newValue = Math.max(min, Math.min(max, currentValue + delta));
      value = [newValue];
    } else {
      const newValues = [...value];
      newValues[thumbIndex] = Math.max(min, Math.min(max, currentValue + delta));
      
      // Ensure values don't cross over
      if (thumbIndex === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (thumbIndex === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0];
      }
      
      value = newValues;
    }
  }

  $: percentage1 = ((value[0] - min) / (max - min)) * 100;
  $: percentage2 = type === "multiple" ? ((value[1] - min) / (max - min)) * 100 : 0;
  $: rangeStart = type === "multiple" ? Math.min(percentage1, percentage2) : 0;
  $: rangeWidth = type === "multiple" ? Math.abs(percentage2 - percentage1) : percentage1;
</script>

<style>
  .slider-root {
    position: relative;
    display: flex;
    width: 100%;
    touch-action: none;
    user-select: none;
    align-items: center;
  }

  .slider-root[data-orientation="vertical"] {
    height: 100%;
    min-height: 176px;
    width: auto;
    flex-direction: column;
  }

  .slider-root[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  .slider-track {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    border-radius: 9999px;
    background-color: #e5e7eb;
    /* cursor: pointer; */
  }

  .slider-track[data-orientation="horizontal"] {
    height: 6px;
    width: 100%;
  }

  .slider-track[data-orientation="vertical"] {
    height: 100%;
    width: 6px;
  }

  .slider-range {
    position: absolute;
    background-color: var(--primary);
    border-radius: inherit;
  }

  .slider-range[data-orientation="horizontal"] {
    height: 100%;
  }

  .slider-range[data-orientation="vertical"] {
    width: 100%;
  }

  .slider-thumb {
    display: block;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 9999px;
    border: 1px solid var(--primary);
    background-color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.15s;
    position: absolute;
    /* cursor: grab; */
    z-index: 10;
  }

  .slider-thumb:hover {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }

  .slider-thumb:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }

  /* .slider-thumb:active {
    cursor: grabbing;
  } */

  .slider-thumb[data-orientation="horizontal"] {
    top: 50%;
    transform: translateY(-50%);
  }

  .slider-thumb[data-orientation="vertical"] {
    left: 50%;
    transform: translateX(-50%);
  }
</style>

<div
  bind:this={ref}
  data-slot="slider"
  data-orientation={orientation}
  class="slider-root {className}"
  data-disabled={disabled || undefined}
  data-type={type}
  data-min={min}
  data-max={max}
  data-step={step}
  data-value={type === "single" ? value[0] : `${value[0]}-${value[1]}`}
  {...restProps}
>
  <div
    bind:this={trackElement}
    data-orientation={orientation}
    data-slot="slider-track"
    class="slider-track"
    role="presentation"
    on:mousedown={handleMouseDown}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <div
      data-slot="slider-range"
      class="slider-range"
      data-orientation={orientation}
      style={orientation === "horizontal" 
        ? `left: ${rangeStart}%; width: ${rangeWidth}%` 
        : `bottom: ${rangeStart}%; height: ${rangeWidth}%`}
    ></div>
  </div>

  <!-- First thumb (or only thumb for single) -->
  <div
    data-slot="slider-thumb"
    class="slider-thumb"
    data-orientation={orientation}
    style={orientation === "horizontal" 
      ? `left: ${percentage1}%` 
      : `bottom: ${percentage1}%`}
    role="slider"
    aria-valuenow={value[0]}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-orientation={orientation}
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled}
    on:keydown={(e) => handleKeyDown(e, 0)}
    on:mousedown={(e) => handleThumbMouseDown(e, 0)}
  ></div>

  <!-- Second thumb for range slider -->
  {#if type === "multiple"}
    <div
      data-slot="slider-thumb"
      class="slider-thumb"
      data-orientation={orientation}
      style={orientation === "horizontal" 
        ? `left: ${percentage2}%` 
        : `bottom: ${percentage2}%`}
      role="slider"
      aria-valuenow={value[1]}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation={orientation}
      tabindex={disabled ? -1 : 0}
      aria-disabled={disabled}
      on:keydown={(e) => handleKeyDown(e, 1)}
      on:mousedown={(e) => handleThumbMouseDown(e, 1)}
    ></div>
  {/if}
</div>