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


<thead
  bind:this={ref}
  data-slot="table-header"
  class="table-header {className}"
  {...restProps}
>
  {@render children?.()}
</thead>