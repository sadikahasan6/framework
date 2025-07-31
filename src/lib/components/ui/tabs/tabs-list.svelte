<script lang="ts">
  let {
    ref = $bindable(null),
    class: className = '',
    children,
    ...restProps
  }: {
    ref?: HTMLElement | null;
    class?: string;
    children: any;
    [key: string]: any;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="tabs-list"
  class="tabs-list {className}"
  {...restProps}
>
  {@render children()}
</div>

<style>
  .tabs-list {
    background-color: #f1f5f9;
    color: #64748b;
    display: inline-flex;
    gap: 0.2rem;
    height: 2rem;
    width: fit-content;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    padding: 3px;
  }
</style>