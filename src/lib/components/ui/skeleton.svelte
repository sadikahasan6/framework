<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  export let style: string = "";
  export let ref: HTMLDivElement | null = null;
  export let restProps: HTMLAttributes<HTMLDivElement> = {};
</script>

<style>
  .skeleton {
    background-color: #f1f1f1; /* Default accent color */
    animation: pulse 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>

<div
  bind:this={ref}
  data-slot="skeleton"
  class={`skeleton`}
  style={style}
  {...restProps}
></div>