<script lang="ts">
  export let variant: "default" | "success" | "error" | "warning" = "default";
  export let message: string = "";
  export let title: string = "";
</script>

<style>
  .alert-container {
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
  }

  .alert-default {
    border-color: #e5e7eb;
  }

  .alert-success {
    border-color: #86efac;
    color: #15803d;
  }

  .alert-error {
    border-color: #f4a1a1;
    color: #dc2626;
  }

  .alert-warning {
    border-color: #fcd34d;
    color: #b45309;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .alert-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .alert-title {
    font-weight: 500;
  }

  .alert-message {
    font-weight: 400;
  }
</style>

<div class="alert-container alert-{variant}">
  <div class="alert-content">
    <div>
      {#if variant === "success"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0" />
            <path d="m8.667 12.633l1.505 1.721a1 1 0 0 0 1.564-.073L15.333 9.3" />
          </g>
        </svg>
      {:else if variant === "error"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16m0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1-6h2v2h-2zm0-10h2v8h-2z"
          />
        </svg>
      {:else if variant === "warning"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zm1.725-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15m0-2.5"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          {...$$props}
        >
          <path
            fill="currentColor"
            d="m11 12l-7.071 7.071l-1.414-1.414L8.172 12L2.515 6.343L3.929 4.93zl7.071 7.07zm0 7h10v2H11z"
          />
        </svg>
      {/if}
    </div>
    <div class="alert-text">
      <div class="alert-title">{title}</div>
      <div class="alert-message">{message}</div>
    </div>
  </div>
</div>