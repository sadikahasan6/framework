<script lang="ts">
  import type { HTMLTdAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    class: className = "",
    children,
    ...restProps
  }: {
    ref?: HTMLTableCellElement | null;
    class?: string;
    children?: any;
  } & HTMLTdAttributes = $props();
</script>

<style>
 
</style>

<td
  bind:this={ref}
  data-slot="table-cell"
  class="table-cell {className}"
  {...restProps}
>
  {@render children?.()}
</td>