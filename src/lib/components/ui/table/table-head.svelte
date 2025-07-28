<script lang="ts">
  import type { HTMLThAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    class: className = "",
    children,
    ...restProps
  }: {
    ref?: HTMLTableCellElement | null;
    class?: string;
    children?: any;
  } & HTMLThAttributes = $props();
</script>

<style>

</style>

<th
  bind:this={ref}
  data-slot="table-head"
  class="table-head {className}"
  {...restProps}
>
  {@render children?.()}
</th>