<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className = '',
    children,
    onValueChange,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    value?: string;
    class?: string;
    children: any;
    onValueChange?: (value: string) => void;
    [key: string]: any;
  } = $props();

  // Create a writable store for the tab value to ensure reactivity
  const valueStore = writable(value);

  // Sync the store with the value prop
  $effect(() => {
    valueStore.set(value);
  });

  // Sync the value prop and call onValueChange when the store changes
  $effect(() => {
    value = $valueStore;
    onValueChange?.($valueStore);
  });

  // Provide context for child components
  setContext('tabs', {
    value: valueStore,
    setValue: (newValue: string) => valueStore.set(newValue)
  });
</script>

<div
  bind:this={ref}
  data-slot="tabs"
  class="tabs-root {className}"
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  .tabs-root {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* gap-2 */
  }
</style>