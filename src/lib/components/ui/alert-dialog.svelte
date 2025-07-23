<script lang="ts">
  import { fade } from "svelte/transition";

  export let open: boolean = false;
  export let title: string = "Alert";
  export let message: string = "Are you sure you want to proceed?";
  export let onConfirm: () => void = () => {};
  export let onCancel: () => void = () => {};
</script>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.56);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  
  .modal-container {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 30rem;
    max-width: 100%;
  }
  
  .modal-header {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
  }
  
  .modal-body {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(107, 114, 128);
    margin: 1rem 0;
  }
  
  .modal-footer {
    padding-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .modal-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    transition: all 0.15s ease-in-out;
    outline: none;
    border: none;
    padding: 0 20px;
    background-color: white;
    height: 35px;
  }
  
  .modal-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 24, 27, 0.2);
  }
  
  .modal-button:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .modal-button-cancel {
    border: 1px solid rgb(209, 213, 219);
    background-color: white;
  }
  
  .modal-button-cancel:hover {
    background-color: rgb(229, 231, 235);
  }
  
  .modal-button-confirm {
    border: none;
    background-color: rgb(0, 0, 0);
    color: white;
  }
  
  .modal-button-confirm:hover {
    background-color: rgb(38, 38, 38);
  }
</style>

{#if open}
  <!-- Overlay with fade transition -->
  <div
    class="modal-overlay"
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
  >
    <div
      class="modal-container"
      in:fade={{ duration: 100 }}
      out:fade={{ duration: 100 }}
    >
      <!-- Modal Header -->
      <div class="modal-header">{title}</div>

      <!-- Modal Body -->
      <div class="modal-body">
        {message}
      </div>

      <!-- Modal Footer with Action Buttons -->
      <div class="modal-footer">
        <button
          class="modal-button modal-button-cancel"
          on:click={onCancel}
        >
          Cancel
        </button>
        <button
          class="modal-button modal-button-confirm"
          on:click={() => {
            onConfirm();
            open = false;
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
{/if}