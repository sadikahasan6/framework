<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    class: className = "",
    children,
    ...restProps
  }: {
    ref?: HTMLTableElement | null;
    class?: string;
    children?: any;
  } & HTMLTableAttributes = $props();
</script>



<div data-slot="table-container" class="table-container">
  <table
    bind:this={ref}
    data-slot="table"
    class="table {className}"
    {...restProps}
  >
    {@render children?.()}
  </table>
</div>