<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  
  let {
    ref = $bindable(null),
    class: className = "",
    children,
    ...restProps
  }: {
    ref?: HTMLTableSectionElement | null;
    class?: string;
    children?: any;
  } & HTMLAttributes<HTMLTableSectionElement> = $props();
</script>

<style>

</style>

<tfoot
  bind:this={ref}
  data-slot="table-footer"
  class="table-footer {className}"
  {...restProps}
>
  {@render children?.()}
</tfoot>