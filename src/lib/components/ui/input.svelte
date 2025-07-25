<script lang="ts">
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
  type InputType = Exclude<HTMLInputTypeAttribute, "file">;
  type Props = 
    Omit<HTMLInputAttributes, "type"> &
      ({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined }) & {
        ref?: HTMLInputElement | null;
      };
  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();
</script>

<style>
.input-base {
  display: flex;
  height: 1.8rem;
  width: 100%;
  min-width: 0;
  border-radius: var(--border-radius);
  border: 1px solid var(--input-border, #ccc);
  outline: none;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background: var(--input-bg, #fff);
  color: var(--input-fg, #222);
  transition: color 0.2s, box-shadow 0.2s;
}
.input-base:focus-visible {
  border-color: var(--input-focus, #acacac);
  background-color: none;
  box-shadow: 0 0 0 3px #acacac86;
}
.input-base[aria-invalid="true"] {
  border-color: var(--input-error, #e53e3e);
  /* box-shadow: 0 0 0 3px rgba(229,62,62,0.2); */
}
.input-base[aria-invalid="true"]:focus-visible {
  box-shadow: 0 0 0 3px rgba(229,62,62,0.2);
}
.input-base::placeholder {
  color: var(--input-placeholder, #686767);
}
.input-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.input-file {
  background: transparent;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.input-file::file-selector-button {
  background: transparent;
  border: none;
  padding: 0;
  margin-right: 1rem;
  height: 100%;
}

</style>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot="input"
    class={`input-base input-file ${className || ""}`}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else}
  <input
    bind:this={ref}
    data-slot="input"
    class={`input-base ${className || ""}`}
    {type}
    bind:value
    {...restProps}
  />
{/if}