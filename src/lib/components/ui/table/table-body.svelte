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


<tbody
  bind:this={ref}
  data-slot="table-body"
  class="table-body {className}"
  {...restProps}
>
  {@render children?.()}
</tbody>