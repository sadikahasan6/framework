<script lang="ts">
  let ref: HTMLButtonElement | null = null;
  let className = "";
  let checked = false;
  let disabled = false;
  let restProps: Record<string, unknown> = {};
  
  $: {
    // Extract any additional props passed in
    const props = $$props;
    const { class: propClass, checked: propChecked, disabled: propDisabled, ...otherProps } = props;
    className = propClass ?? "";
    checked = propChecked ?? false;
    disabled = propDisabled ?? false;
    restProps = otherProps;
  }
</script>

<style>
  .switch {
    --primary-color: #3b82f6;
    --input-color: #e5e7eb;
    --ring-color: #93c5fd;
    --background-color: #ffffff;
    --foreground-color: #1f2937;
    --primary-foreground-color: #eff6ff;
    --input-opacity: 0.8;
    
    display: inline-flex;
    align-items: center;
    height: 1.15rem;
    width: 2rem;
    flex-shrink: 0;
    border: 1px solid transparent;
    border-radius: 9999px;
    outline: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .switch:focus-visible {
    border-color: var(--ring-color, #93c5fd);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring-color, #93c5fd) 50%, transparent);
  }
  
  .switch:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .switch[data-state="checked"] {
    background-color: var(--primary, #3b82f6);
  }
  
  .switch[data-state="unchecked"] {
    background-color: var(--input-color, #e5e7eb);
  }
  
  .switch.dark[data-state="unchecked"] {
    background-color: color-mix(in srgb, var(--input-color, #e5e7eb) calc(var(--input-opacity, 0.8) * 100%), transparent);
  }
  
  .switch-thumb {
    pointer-events: none;
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    box-shadow: none;
    transition: transform 0.2s ease;
    background-color: var(--background-color, #ffffff);
  }
  
  .switch-thumb[data-state="checked"] {
    transform: translateX(calc(100% - 8px));
  }
  
  .switch-thumb[data-state="unchecked"] {
    transform: translateX(-6px);
  }
  
  .switch-thumb.dark[data-state="unchecked"] {
    background-color: var(--foreground-color, #1f2937);
  }
  
  .switch-thumb.dark[data-state="checked"] {
    background-color: var(--primary-foreground-color, #eff6ff);
  }
</style>

<button
  bind:this={ref}
  id={$$props.id}
  class={`switch ${className}`}
  role="switch"
  data-slot="switch"
  aria-checked={checked}
  data-state={checked ? "checked" : "unchecked"}
  disabled={disabled}
  on:click={() => (checked = !checked)}
  {...restProps}
>
  <span
    class="switch-thumb"
    data-slot="switch-thumb"
    data-state={checked ? "checked" : "unchecked"}
  />
</button>