<script lang="ts">
  import { scale } from 'svelte/transition';
  import Calendar from "$lib/components/ui/calendar.svelte";

  interface Props {
    placeholder?: string;
    value?: Date | string | null;
    onselect?: (date: Date) => void;
    selectedDate?: Date | null;
  }

  let { 
    placeholder = '',
    value = null,
    onselect = (date: Date) => {},
    selectedDate = null,
  }: Props = $props();

  let open = $state(false);
  let dropdownAbove = $state(false);
  let buttonRef = $state<HTMLButtonElement | null>(null);
  let containerRef = $state<HTMLDivElement | null>(null);

  function toggleOpen() {
    open = !open;
    if (open) {
      setTimeout(adjustDropdownDirection, 0);
    }
  }

  function handleDateSelect(event: { detail: Date }) {
    const date = event.detail;
    value = date;
    open = false;
    onselect(date);
  }

  function formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function adjustDropdownDirection() {
    if (!buttonRef) return;
    const rect = buttonRef.getBoundingClientRect();
    const dropdownHeight = 350;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    dropdownAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
  }

  function handleClickOutside(event: MouseEvent) {
    if (containerRef && event.target && !containerRef.contains(event.target as Node)) {
      // Check if the click was on the button that opens the dropdown
      if (buttonRef && buttonRef.contains(event.target as Node)) {
        return; // Don't close if clicking the button
      }
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', adjustDropdownDirection);
      window.addEventListener('scroll', adjustDropdownDirection, true);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('resize', adjustDropdownDirection);
        window.removeEventListener('scroll', adjustDropdownDirection, true);
      };
    }
  });
</script>

<div bind:this={containerRef} class="datepicker-container">
  <button
    bind:this={buttonRef}
    onclick={toggleOpen}
    class="datepicker-button"
    aria-haspopup="dialog"
    aria-expanded={open}
  >
    <svg class="datepicker-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z"/>
    </svg>
    <span class={value ? 'datepicker-value' : 'datepicker-placeholder'}>
      {value ? formatDate(value) : placeholder || 'Select a date'}
    </span>
  </button>

  {#if open}
    <div
      class="datepicker-dropdown {dropdownAbove ? 'datepicker-dropdown-above' : 'datepicker-dropdown-below'}"
      role="dialog"
      aria-modal="true"
      in:scale={{ start: 0.95, duration: 200 }}
      out:scale={{ start: 0.95, duration: 200 }}
    >
      <Calendar selectedDate={value instanceof Date ? value : value ? new Date(value) : null} on:select={handleDateSelect} />
    </div>
  {/if}
</div>

<style>
.datepicker-container {
  position: relative;
  width: 256px;
}

.datepicker-button {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.datepicker-button:hover {
  background: #f3f4f6;
}

.datepicker-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.datepicker-value {
  color: #111827;
}

.datepicker-placeholder {
  color: #6b7280;
}

.datepicker-dropdown {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 20;
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.datepicker-dropdown-below {
  top: 100%;
  margin-top: 0.25rem;
}

.datepicker-dropdown-above {
  bottom: 100%;
  margin-bottom: 0.25rem;
}
</style>