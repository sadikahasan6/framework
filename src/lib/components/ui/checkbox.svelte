<script lang="ts">
	let ref: HTMLInputElement | null = null;
	let checked = false;
	let indeterminate = false;
	let className = '';
	let restProps: Record<string, any> = {};
	export let id: string = '';
</script>

<!-- Wrapper div for the custom checkbox -->
<div class="checkbox-container">
	<!-- Hidden native checkbox for accessibility -->
	<input
		type="checkbox"
		bind:this={ref}
		class="checkbox-input {className}"
		bind:checked
		bind:indeterminate
		{id}
		{...restProps}
	/>

	<!-- Custom-styled checkbox (visual replacement) -->
	<div class="checkbox-custom">
		{#if checked}
			<span class="checkbox-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					{...$$props}
				>
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 6L9 17l-5-5"
					/>
				</svg>
			</span>
		{:else if indeterminate}
			<span class="checkbox-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					{...$$props}
				>
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 12h14"
					/>
				</svg>
			</span>
		{/if}
	</div>
</div>

<style>
	.checkbox-container {
		display: inline-flex;
		align-items: center;
		position: relative;
		cursor: pointer;
	}

	.checkbox-input {
		/* Hide the default checkbox but keep it accessible */
		position: absolute;
		opacity: 0;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.checkbox-custom {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		background-color: rgba(226, 232, 240, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	/* Checked state */
	.checkbox-input:checked + .checkbox-custom {
		background-color: var(--primary);
		border-color: var(--primary);
		color: white;
	}

	/* Indeterminate state (simulated) */
	.checkbox-input:indeterminate + .checkbox-custom {
		background-color: #3b82f6;
		border-color: #3b82f6;
		color: white;
	}

	/* Focus state */
	.checkbox-input:focus-visible + .checkbox-custom {
		outline: 2px solid #94a3b8;
		outline-offset: 2px;
	}

	/* Disabled state */
	.checkbox-input:disabled + .checkbox-custom {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.checkbox-icon {
		width: 14px;
		height: 14px;
		font: 12px sans-serif;
		color: inherit;
	}
</style>
