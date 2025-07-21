<script lang="ts">
  import { slide } from "svelte/transition";

  export let items: { title: string; content: string }[] = [];
  let openIndex: number | null = null;
</script>

<div class="container">
  {#each items as item, i}
    <div class="accordion">
      <button
        class="w-full text-left py-3 text-sm font-medium flex justify-between items-center hover:underline hover:underline-offset-2 cursor-pointer"
        on:click={() => (openIndex = openIndex === i ? null : i)}
        aria-expanded={openIndex === i}
        aria-controls={`accordion-${i}`}
      >
        <span>{item.title}</span>
        <!-- Chevron SVG with rotation -->
        <svg
          class="chevron-icon"
          class:rotate-180={openIndex === i}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {#if openIndex === i}
        <div
          id={`accordion-${i}`}
          class="content"
          in:slide={{ duration: 200 }}
          out:slide={{ duration: 150 }}
        >
          {item.content}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .container {
    width: 100%; 
    max-width: 28rem; 
    margin-left: auto; 
    margin-right: auto; 
  }
  .accordion {
    border-bottom: 1px solid #ccc;
  }
  button {
    padding: 0.75rem 0;
    background-color: transparent;
    outline: none;
    border: none;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }


  button:hover {
    text-decoration: underline;
  }


  button:hover {
    text-underline-offset: 0.125rem; 
  }
  .chevron-icon {
    width: 1rem; /* 16px */
    height: 1rem; /* 16px */
    margin-left: 0.5rem; /* 8px */
    transition: transform 200ms ease-in-out;
  }

  .chevron-icon.rotate-180 {
    transform: rotate(180deg);
  }
  .content {
    padding-top: 0.3rem;
    padding-bottom: 0.75rem; 
    font-size: 0.86rem;
    line-height: 1.25rem;
    font-weight: 400; 
  }
</style>
