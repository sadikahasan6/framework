<script lang="ts">
  export let ref: HTMLLabelElement | null = null;
  export let className: string = "";
  
  export let disabled: boolean = false;
  export let forId: string | undefined;
  export let restProps: Record<string, any> = {};
</script>

<style>
.label-root {
  display: flex;
  user-select: none;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
}
.label-root.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
</style>

<label
  bind:this={ref}
  data-slot="label"
  class={`label-root${disabled ? " disabled" : ""} ${className}`}
  for={forId}
  aria-disabled={disabled}
  {...restProps}
>
  <slot />
</label>