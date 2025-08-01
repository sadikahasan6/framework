<script lang="ts">
  import { writable } from 'svelte/store';
  
  export let ref: HTMLDivElement | null = null;
  export const loadingStatus = "loading";
  export let className: string = '';
  export let src: string | undefined;
  export let alt: string = '';
  export const delayMs = 0;

  let showFallback = writable(false);
  let loaded = writable(false);
  let isLoading = writable(true);
  
  function handleError() {
    showFallback.set(true);
    isLoading.set(false);
  }
  
  function handleLoad() {
    loaded.set(true);
    isLoading.set(false);
  }

  function getInitials(name: string): string {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }
</script>

<style>
  .avatar {
    position: relative;
    display: flex;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  .avatar-fallback {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 14px;
    color: #666;
  }

  .loading-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div bind:this={ref} class={`avatar ${className}`} data-slot="avatar">
  <!-- {#if $isLoading}
    <div class="loading-indicator">Loading...</div>
  {/if} -->

  {#if src && !$showFallback}
    <img
      src={src}
      alt={alt}
      class="avatar-image"
      on:error={handleError}
      on:load={handleLoad}
      data-slot="avatar-image"
    />
  {:else}
    <div class="avatar-fallback" data-slot="avatar-fallback">
      {#if alt}
        {getInitials(alt)}
      {:else}
        ?
      {/if}
    </div>
  {/if}
</div>