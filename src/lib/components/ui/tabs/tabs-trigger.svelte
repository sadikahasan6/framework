<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  let {
    ref = $bindable(null),
    class: className = '',
    value: triggerValue = '',
    children,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    value?: string;
    children: any;
    [key: string]: any;
  } = $props();

  const { value: activeTab, setValue } = getContext<{
    value: Writable<string>;
    setValue: (value: string) => void;
  }>('tabs');

  function handleClick() {
    setValue(triggerValue);
  }

  const isActive = $derived($activeTab === triggerValue);
</script>

<button
  bind:this={ref}
  data-slot="tabs-trigger"
  data-state={isActive ? 'active' : 'inactive'}
  class="tabs-trigger {className}"
  onclick={handleClick}
  {...restProps}
>
  {@render children?.()}
</button>

<style>
  .tabs-trigger {
    display: inline-flex;
    height: calc(100% - 1px);
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    border: 1px solid transparent;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    cursor: pointer;
    color: #0f172a;
    background-color: transparent;
  }

  .tabs-trigger[data-state="active"] {
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .tabs-trigger:focus-visible {
    outline: 1px solid #3b82f6;
    outline-offset: 0;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  .tabs-trigger:hover:not([data-state="active"]) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .tabs-trigger:disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tabs-trigger :global(svg:not([class*='size-'])) {
    width: 1rem;
    height: 1rem;
  }

  .tabs-trigger :global(svg) {
    pointer-events: none;
    flex-shrink: 0;
  }

  @media (prefers-color-scheme: dark) {
    .tabs-trigger {
      color: #64748b;
    }

    .tabs-trigger[data-state="active"] {
      color: #f8fafc;
      border-color: #374151;
      background-color: rgba(55, 65, 81, 0.3);
    }

    .tabs-trigger:hover:not([data-state="active"]) {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
</style>