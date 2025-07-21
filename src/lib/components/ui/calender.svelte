<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher<{
    select: Date;
  }>();

  export let selectedDate: Date | null = null;
  let currentDate: Date = new Date();
  let days: (number | null)[] = [];
  let showMonthPicker = false;
  let showYearPicker = false;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  function getDaysInMonth(year: number, month: number): (number | null)[] {
    const date = new Date(year, month, 1);
    const result: (number | null)[] = [];
    const firstDayIndex = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) result.push(null);
    for (let i = 1; i <= lastDay; i++) result.push(i);
    return result;
  }

  // Renamed and modified to navigate months
  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    updateCalendar();
  }

  // Renamed and modified to navigate months
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
    dispatch('select', date);
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
    return selectedDate !== null &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();
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

  let yearPickerCenter = currentDate.getFullYear();

  function shiftYearRange(offset: number) {
    yearPickerCenter += offset;
  }

  onMount(updateCalendar);
</script>

<div class="calendar-container">
  <div class="calendar-header">
    <button
      on:click={prevMonth}
      class="calendar-nav-button"
      aria-label="Previous month"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m18 16l-6-6l6-6"
        />
      </svg>
    </button>

    <h2 class="calendar-title">
      <span
        class="calendar-month-display"
        on:click={toggleMonthPicker}
        tabindex="0"
        role="button"
        aria-label="Select month"
      >
        {monthNames[currentDate.getMonth()]}
      </span>
      <span
        class="calendar-year-display"
        on:click={toggleYearPicker}
        tabindex="0"
        role="button"
        aria-label="Select year"
      >
        {currentDate.getFullYear()}
      </span>
    </h2>

    <button
      on:click={nextMonth}
      class="calendar-nav-button"
      aria-label="Next month"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"

        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m6 16l6-6l-6-6"
        />
      </svg>
    </button>
  </div>

  {#if showMonthPicker}
    <div class="month-picker">
      <div class="month-picker-grid">
        {#each monthNames as month, index}
          <button
            type="button"
            class="month-picker-item"
            class:selected-month={currentDate.getMonth() === index}
            on:click={() => selectMonth(index)}
          >
            {month.slice(0, 3)}
          </button>
        {/each}
      </div>
    </div>
  {:else if showYearPicker}
    <div class="year-picker">
      <div class="year-picker-header">
        <button on:click={() => shiftYearRange(-10)} class="year-picker-nav">
          &lt;&lt;
        </button>
        <span>{yearPickerCenter - 5} - {yearPickerCenter + 6}</span>
        <button on:click={() => shiftYearRange(10)} class="year-picker-nav">
          &gt;&gt;
        </button>
      </div>
      <div class="year-picker-grid">
        {#each getYearRange(yearPickerCenter) as year}
          <button
            type="button"
            class="year-picker-item"
            class:selected-year={currentDate.getFullYear() === year}
            on:click={() => selectYear(year)}
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
            on:click={() => selectDate(day)}
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
  /* Main container styles */
  .calendar-container {
    width: 15rem;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    padding: 1rem;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
  }

  /* Header styles */
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .calendar-nav-button {
  display: inline-flex; /* Use inline-flex instead of flex for better inline behavior */
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  aspect-ratio: 1/1;
  padding: 0; /* Remove any default padding */
  margin: 0; /* Remove any default margin */
  border-radius: 0.5rem;
  transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
  border: none;
  cursor: pointer;
  }
    .calendar-nav-button svg {
      display: block; /* Remove any extra space around SVG */
  width: 1.25rem; /* Set explicit size */
  height: 1.25rem; /* Set explicit size */
  margin: auto; /* Additional centering */
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
    border-radius: 0.25rem;
    transition: background-color 150ms ease-in-out;
    user-select: none;
  }

  .calendar-month-display:hover,
  .calendar-year-display:hover {
    background-color: #f0f0f0;
  }

  /* Day names header */
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

  /* Days grid */
  .calendar-days-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.4rem;
  }

  /* Individual day button */
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

  /* Specific styles for "today" */
  .calendar-day-button.is-today {
    background-color: #e0f2fe;
    color: #2563eb;
    font-weight: 500;
  }

  /* Specific styles for "selected" date */
  .calendar-day-button.is-selected {
    background-color: #374151;
    color: #fff;
  }

  /* Month picker styles */
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
    border-radius: 0.25rem;
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
    background-color: #374151;
    color: #fff;
  }

  /* Year picker styles */
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
    border-radius: 0.25rem;
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
    background-color: #374151;
    color: #fff;
  }
</style>