<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' = 'default';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let isLoading = false;
	export let disabled = false;
</script>

<button
	{type}
	disabled={disabled || isLoading}
	on:click
	class={`btn ${{ sm: 'sm', md: 'md', lg: 'lg' }[size]} ${{ default: 'default', destructive: 'destructive', ghost: 'ghost', link: 'link', outline: 'outline' }[variant]}`}
>
	{#if isLoading}
		<svg
			class="mr-2 h-4 w-4 animate-spin text-current"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle style="opacity: 20%;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path style="opacity: 75%;" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
		</svg>
		Loading...
	{:else}
		<slot />
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		transition: all 0.15s ease-in-out;
		outline: none;
		border: none;
		padding: 0 15px;
		background-color: white;
	}
	.sm {
		height: 25px;
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
	.default:hover {
		background-color: var(--primary-hover);
	}
	.destructive {
		background-color: var(--destructive);
		color: white;
	}
	.destructive:hover {
		background-color: var(--destructive-hover);
	}
	.outline {
		border: 1px solid #cccaca;
		box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
	}
	.outline:hover {
		background-color: #eeeded;
	}
	.ghost:hover {
		background-color: #eeeded;
	}
	.link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.btn:disabled {
		filter: grayscale(0.4);
		opacity: 50%;
	}
</style>
