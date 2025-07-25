<script lang="ts">
  import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';
const dispatcher = createEventDispatcher<{ select: Date }>();
    let { 
    selectedDate = null,
    onSelect = () => {}
  } = $props();
  let currentDate: Date = $state(new Date());
  let days: (number | null)[] = $state([]);
  let showMonthPicker = $state(false);
  let showYearPicker = $state(false);
  

  // Month and day names for display
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Use $derived for reactive computed values
  const currentMonth = $derived(monthNames[currentDate.getMonth()]);
  const currentYear = $derived(currentDate.getFullYear());

  function getDaysInMonth(year: number, month: number): (number | null)[] {
    const date = new Date(year, month, 1);
    const result: (number | null)[] = [];
    const firstDayIndex = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) result.push(null);
    for (let i = 1; i <= lastDay; i++) result.push(i);
    return result;
  }

  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    updateCalendar();
  }

  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    updateCalendar();
  }

  function updateCalendar() {
    days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  }

  function selectDate(day: number) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    selectedDate = date;
    onSelect(date);
    dispatcher('select', date);
  }

  function isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  }

  function isSelected(day: number): boolean {
    return (
      selectedDate !== null &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  }

  function toggleMonthPicker() {
    showMonthPicker = !showMonthPicker;
    showYearPicker = false;
  }

  function toggleYearPicker() {
    showYearPicker = !showYearPicker;
    showMonthPicker = false;
  }

  function selectMonth(monthIndex: number) {
    currentDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    updateCalendar();
    showMonthPicker = false;
  }

  function selectYear(year: number) {
    currentDate = new Date(year, currentDate.getMonth(), 1);
    updateCalendar();
    showYearPicker = false;
  }

  function getYearRange(centerYear: number) {
    const years = [];
    for (let i = centerYear - 5; i <= centerYear + 6; i++) {
      years.push(i);
    }
    return years;
  }

  let yearPickerCenter: number = $derived(currentDate.getFullYear());

  function shiftYearRange(offset: number) {
    yearPickerCenter += offset;
  }

  onMount(updateCalendar);
</script>

<div class="calendar-container">
  <div class="calendar-header">
    <button onclick={prevMonth} class="calendar-nav-button" aria-label="Previous month">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" d="m15 6l-6 6l6 6"></path>
      </svg>
    </button>

    <h2 class="calendar-title">
      <button
        type="button"
        class="calendar-month-display"
        onclick={toggleMonthPicker}
        tabindex="0"
        aria-label="Select month"
      >
        {currentMonth}
      </button>
      <button
        type="button"
        class="calendar-year-display"
        onclick={toggleYearPicker}
        tabindex="0"
        aria-label="Select year"
      >
        {currentYear}
      </button>
    </h2>

    <button onclick={nextMonth} class="calendar-nav-button" aria-label="Next month">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" d="m9 6l6 6l-6 6"></path>
      </svg>
    </button>
  </div>

  {#if showMonthPicker}
    <div
      class="month-picker"
      onclick={e => e.stopPropagation()}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
      role="presentation"
      aria-label="Month picker"
    >
      <div class="month-picker-grid">
        {#each monthNames as month, index}
          <button
            type="button"
            class="month-picker-item"
            class:selected-month={currentDate.getMonth() === index}
            onclick={() => selectMonth(index)}
            aria-label={`Select ${month}`}
          >
            {month.slice(0, 3)}
          </button>
        {/each}
      </div>
    </div>
  {:else if showYearPicker}
    <div
      class="year-picker"
      role="presentation"
      onclick={e => e.stopPropagation()}
      onkeydown={(e) => {
        // Allow Escape and Tab to bubble, but stop propagation for Enter/Space
        if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
      }}
      aria-label="Year picker"
    >
      <div class="year-picker-header">
        <button 
          type="button"
          onclick={() => shiftYearRange(-10)} 
          class="year-picker-nav"
          aria-label="Previous decade"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m12 6l-6 6l6 6m6-12l-6 6l6 6"
            />
          </svg>
        </button>
        <span>{yearPickerCenter - 5} - {yearPickerCenter + 6}</span>
        <button 
          type="button"
          onclick={() => shiftYearRange(10)} 
          class="year-picker-nav"
          aria-label="Next decade"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m12 18l6-6l-6-6M6 18l6-6l-6-6"
            />
          </svg>
        </button>
      </div>
      <div class="year-picker-grid">
        {#each getYearRange(yearPickerCenter) as year}
          <button
            type="button"
            class="year-picker-item"
            class:selected-year={currentDate.getFullYear() === year}
            onclick={() => selectYear(year)}
            aria-label={`Select year ${year}`}
          >
            {year}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="calendar-day-names">
      {#each dayNames as day}
        <div class="calendar-day-name-item">{day}</div>
      {/each}
    </div>

    <div class="calendar-days-grid">
      {#each days as day}
        {#if day === null}
          <div></div>
        {:else}
          <button
            type="button"
            class="calendar-day-button"
            class:is-today={isToday(day)}
            class:is-selected={isSelected(day)}
            onclick={() => selectDate(day)}
            aria-pressed={isSelected(day)}
            aria-label={`Select ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`}
          >
            {day}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .calendar-container {
    width: 222px;
    border-radius: var(--border-radius);
    border: 1px solid #d1d5db;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .calendar-nav-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    aspect-ratio: 1/1;
    padding: 0px;
    margin: 0;
    border-radius: 0.5rem;
    transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .calendar-nav-button svg {
    display: block;
    width: 1.6rem;
    height: 1.6rem;
    margin: auto;
    padding: 0;
  }

  .calendar-nav-button:hover {
    background-color: #e5e7eb;
  }

  .calendar-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a202c;
    display: flex;
    gap: 0.3em;
  }

  .calendar-month-display,
  .calendar-year-display {
    cursor: pointer;
    padding: 0 0.2em;
    border-radius: var(--border-radius);
    transition: background-color 150ms ease-in-out;
    user-select: none;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    font-weight: 600;
  }

  .calendar-month-display:hover,
  .calendar-year-display:hover {
    background-color: #f0f0f0;
  }

  .calendar-day-names {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    text-align: center;
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
  }

  .calendar-day-name-item {
    font-weight: 500;
  }

  .calendar-days-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .calendar-day-button {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 0.5rem;
    text-align: center;
    transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.95rem;
    color: #1f2937;
  }

  .calendar-day-button:hover {
    background-color: #e5e7eb;
    border: 1px solid #d1d5db;
  }

  .calendar-day-button.is-today {
    background-color: #e0f2fe;
    color: #2563eb;
    font-weight: 500;
  }

  .calendar-day-button.is-selected {
    background-color: var(--primary);
    color: #fff;
  }

  .month-picker {
    margin: 0.5rem 0;
  }

  .month-picker-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .month-picker-item {
    padding: 0.5rem;
    border-radius: var(--border-radius);
    text-align: center;
    cursor: pointer;
    border: none;
    background: none;
    transition: background-color 150ms ease-in-out;
  }

  .month-picker-item:hover {
    background-color: #e5e7eb;
  }

  .month-picker-item.selected-month {
    background-color: var(--primary);
    color: #fff;
  }

  .year-picker {
    margin: 0.5rem 0;
    max-height: 200px;
    overflow-y: auto;
  }

  .year-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
  }

  .year-picker-nav {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .year-picker-nav:hover {
    background-color: #e5e7eb;
  }

  .year-picker-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .year-picker-item {
    padding: 0.5rem;
    border-radius: var(--border-radius);
    text-align: center;
    cursor: pointer;
    border: none;
    background: none;
    transition: background-color 150ms ease-in-out;
  }

  .year-picker-item:hover {
    background-color: #e5e7eb;
  }

  .year-picker-item.selected-year {
    background-color: var(--primary);
    color: #fff;
  }
</style>