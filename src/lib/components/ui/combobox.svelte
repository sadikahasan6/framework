<script lang="ts">
  import { scale } from "svelte/transition";
  interface Props {
    options?: string[];
    placeholder?: string;
    searchPlaceholder?: string;
    value?: string | null;
    onselect?: (option: string) => void;
  }

  let {
    options = [],
    placeholder = "",
    searchPlaceholder = "",
    value = null,
    onselect = () => {},
  }: Props = $props();

  let query = $state("");
  let open = $state(false);
  let activeIndex = $state(-1);
  let dropdownAbove = $state(false);
  let buttonRef = $state<HTMLButtonElement | null>(null);
  let dropdownRef = $state<HTMLDivElement | null>(null);
  let containerRef = $state<HTMLDivElement | null>(null);

  const filtered = $derived(
    options.filter((opt: string) =>
      opt.toLowerCase().includes(query.toLowerCase()),
    ),
  );

  function toggleOpen() {
    open = !open;
    if (open) {
      setTimeout(() => {
        const input = document.getElementById("search-box") as HTMLInputElement;
        input?.focus();
        adjustDropdownDirection();
      }, 0);
    }
  }

  function selectOption(option: string) {
    value = option;
    query = "";
    open = false;
    onselect(option);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % filtered.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) selectOption(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      open = false;
    }
  }

  function adjustDropdownDirection() {
    if (!buttonRef) return;
    const rect = buttonRef.getBoundingClientRect();
    const dropdownHeight = 250;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    dropdownAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      containerRef &&
      event.target &&
      !containerRef.contains(event.target as Node)
    ) {
      open = false;
    }
  }

  // Handle click outside and window events
  $effect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", adjustDropdownDirection);
      window.addEventListener("scroll", adjustDropdownDirection, true);

      return () => {
        document.removeEventListener("click", handleClickOutside);
        window.removeEventListener("resize", adjustDropdownDirection);
        window.removeEventListener("scroll", adjustDropdownDirection, true);
      };
    }
  });

  // Reset active index when filtered options change
  $effect(() => {
    if (filtered.length > 0 && activeIndex >= filtered.length) {
      activeIndex = 0;
    } else if (filtered.length === 0) {
      activeIndex = -1;
    }
  });
</script>

<div bind:this={containerRef} class="combo-container">
  <button
    bind:this={buttonRef}
    onclick={toggleOpen}
    class="combo-button"
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span class={value ? "combo-value" : "combo-placeholder"}>
      {value || placeholder}
    </span>
    <svg
      class="combo-chevron"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      ><path
        fill="currentColor"
        d="M4.146 6.354a.5.5 0 0 0 .708 0L8 3.207l3.146 3.147a.5.5 0 0 0 .708-.708l-3.5-3.5a.5.5 0 0 0-.708 0l-3.5 3.5a.5.5 0 0 0 0 .708m0 3.292a.5.5 0 0 1 .708 0L8 12.793l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 0 1 0-.708"
      /></svg
    >
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      class="combo-dropdown {dropdownAbove ? 'combo-dropdown-above' : 'combo-dropdown-below'}"
      in:scale={{ start: 0.95, duration: 200 }}
      out:scale={{ start: 0.95, duration: 200 }}
    >
      <div class="combo-search-container">
        <input
          id="search-box"
          type="text"
          bind:value={query}
          onkeydown={handleKeydown}
          placeholder={searchPlaceholder}
          class="combo-search"
          role="searchbox"
          aria-label="Search options"
        />
        <svg
          class="combo-search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          ><path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m20 20l-4.05-4.05m0 0a7 7 0 1 0-9.9-9.9a7 7 0 0 0 9.9 9.9"
          /></svg
        >
      </div>

      <ul class="combo-list" role="listbox">
        {#each filtered as option, i}
          <li role="none">
            <button
              type="button"
              class="combo-option {i === activeIndex ? 'combo-option-active' : ''} {value === option ? 'combo-option-selected' : ''}"
              onclick={() => selectOption(option)}
              role="option"
              aria-selected={value === option}
            >
              
              <span class="combo-checkmark">
                              {#if value === option}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  ><path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 11.917L9.724 16.5L19 7.5"
                  /></svg
                >
              {/if}
              </span>
              <span style="flex-grow: 1; padding-left: 0.35rem; display: flex; align-items: center;">{option}</span>
            </button>
          </li>
        {/each}
        {#if filtered.length === 0}
          <li class="combo-no-results">No results found</li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style>
.combo-container {
  position: relative;
  min-width: 240px;
  width: fit-content;
}

.combo-button {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.15s;
}
.combo-button:hover {
  background: #f3f4f6;
}

.combo-value {
  color: #111827;
}
.combo-placeholder {
  color: #6b7280;
}

.combo-chevron {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.combo-dropdown {
  position: absolute;
  z-index: 20;
  width: 100%;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  box-sizing: border-box;
}
.combo-dropdown-above {
  bottom: 100%;
  margin-bottom: 0.25rem;
}
.combo-dropdown-below {
  top: 100%;
  margin-top: 0.25rem;
}

.combo-search-container {
  position: relative;
}

.combo-search {
  box-sizing: border-box;
  border: none;
  width: 100%;
  overflow-x: hidden;
  padding: 0.7rem 2.5rem 0.7rem 2.2rem;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
  border-radius: 0.375rem 0.375rem 0 0;
  font-size: 1rem;
}
.combo-search::placeholder {
  opacity: 1;
  font-size: 0.9rem;     
}

.combo-search-icon {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
}

.combo-list {
  max-height: 240px;
  overflow-y: auto;
  padding: 0.25rem 0;
  margin: 0;
  list-style: none;
}

.combo-option {
  width: calc(100% - 0.5rem);
  text-align: left;
  padding: 0.5rem 0.4rem;
  margin: 0 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #111827;
  transition: background 0.15s;
}
.combo-option:hover,
.combo-option:focus {
  background: #f3f4f6;
  outline: none;
}
.combo-option-active {
  background: #e0e7ff;
}
.combo-option-selected {
  font-weight: 600;
}

.combo-checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.combo-no-results {
  padding: 0.75rem 1rem;
  color: #9ca3af;
  font-size: 0.95rem;
}
</style>