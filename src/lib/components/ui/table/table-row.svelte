<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    class: className = "",
    children,
    ...restProps
  }: {
    ref?: HTMLTableRowElement | null;
    class?: string;
    children?: any;
  } & HTMLAttributes<HTMLTableRowElement> = $props();
</script>



<tr
  bind:this={ref}
  data-slot="table-row"
  class="table-row {className}"
  {...restProps}
>
  {@render children?.()}
</tr>