<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let variant: "default" | "destructive" | "outline" | "ghost" | "link" =
    "default";
  export let size: "sm" | "md" | "lg" = "md";
  export let isLoading = false;
  export let disabled = false;
</script>

<button
  {type}
  disabled={disabled || isLoading}
  on:click
  class={`btn ${{ sm: "sm", md: "md", lg: "lg" }[size]} ${{ default: "default", destructive: "destructive", ghost: "ghost", link: "link", outline: "outline" }[variant]}`}
>
  {#if isLoading}
    <span class="loader"></span> &nbsp; Loading...
  {:else}
    <slot />
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    transition: all 0.15s ease-in-out;
    outline: none;
    border: none;
    padding: 0 15px;
    background-color: white;
  }

  .btn:hover {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    opacity: 0.8;
    cursor: pointer;
  }
  .sm {
    height: 30px;
  }
  .md {
    height: 35px;
  }
  .lg {
    height: 45px;
  }
  .default {
    background-color: var(--primary);
    color: white;
  }
  .destructive {
    background-color: var(--destructive);
    color: white;
  }

  .outline {
    border: 1px solid #ccc;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }
  .outline:hover {
    background-color: #eeeded;
  }
  .ghost {
    background-color: transparent;
    /* color: var(--primary); */
  }
  .link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .btn:disabled {
    filter: grayscale(0.2);
    opacity: 0.5;
    cursor: not-allowed;
  }
  .loader {
    width: 1rem;
    height: 1rem;
    border: 0.11rem solid currentColor;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 0.7s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
</style>
