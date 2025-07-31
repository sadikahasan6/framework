<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  let {
    ref = $bindable(null),
    class: className = '',
    value: contentValue = '',
    children,
    ...restProps
  } = $props();

  // Get context and destructure the store
  const { value: activeTabStore } = getContext<{
    value: Writable<string>;
    setValue: (value: string) => void;
  }>('tabs');

  // Properly use the store with $ prefix
  const isActive = $derived($activeTabStore === contentValue);
</script>

{#if isActive}
  <div
    bind:this={ref}
    data-slot="tabs-content"
    data-state={isActive ? 'active' : 'inactive'}
    class="tabs-content {className}"
    {...restProps}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .tabs-content {
    flex: 1;
    outline: none;
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>