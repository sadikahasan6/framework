<script lang="ts">
	import { onMount } from "svelte";
	import { scale } from "svelte/transition";

	// Better type definition that handles both regular items and dividers
	type MenuItem =
		| {
				label: string;
				icon?: string;
				shortcut?: string;
				action?: () => void;
				disabled?: boolean;
				divider?: never;
		  }
		| {
				divider: true;
				label?: never;
				icon?: never;
				shortcut?: string;
				action?: never;
				disabled?: never;
		  };

	export let items: MenuItem[] = [];
	export let x: number = 0;
	export let y: number = 0;
	export let visible: boolean = false;
	export let close: () => void = () => {};

	let contextMenu: HTMLDivElement;

	onMount(() => {
		document.addEventListener("click", handleClickOutside);
		document.addEventListener("contextmenu", handleContextMenuOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("contextmenu", handleContextMenuOutside);
		};
	});

	function handleClickOutside(event: MouseEvent) {
		if (contextMenu && !contextMenu.contains(event.target as Node)) {
			visible = false;
			close();
		}
	}

	function handleContextMenuOutside(event: MouseEvent) {
		if (contextMenu && !contextMenu.contains(event.target as Node)) {
			visible = false;
			close();
		}
	}

	function handleItemClick(item: MenuItem) {
		if ("action" in item && item.action && !item.disabled) {
			item.action();
			visible = false;
			close();
		}
	}
</script>

<style>
	.context-menu {
		position: fixed;
		z-index: 50;
		border-radius: var(--border-radius);
		border: 1px solid #e5e7eb;
		background-color: white;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		min-width: 15rem;
	}

	.context-menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.context-menu-divider {
		border-bottom: 1px solid #e5e7eb;
		margin: 0.25rem 0;
	}

	.context-menu-item {
		margin: 0.25rem;
	}

	.context-menu-button {
		display: flex;
		border-radius: var(--border-radius);
		width: 100%;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		color: #374151;
		background: none;
		border: none;
		text-align: left;
		transition: background-color 0.2s ease;
	}

	.context-menu-button:hover {
		background-color: #f3f4f6;
	}

	.context-menu-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.context-menu-button.cursor-pointer {
		cursor: pointer;
	}

	.context-menu-icon {
		width: 1.25rem;
	}

	.context-menu-label {
		flex: 1;
	}

	.context-menu-shortcut {
		font-size: 0.75rem;
		color: #9ca3af;
		margin-left: auto;
	}
</style>

{#if visible}
	<div
		bind:this={contextMenu}
		class="context-menu"
		in:scale={{ start: 0.95, duration: 200 }}
		out:scale={{ start: 0.95, duration: 200 }}
		style="left: {x}px; top: {y}px;"
	>
		<ul
			in:scale={{ start: 0.95, duration: 200 }}
			out:scale={{ start: 0.95, duration: 200 }}
		>
			{#each items as item, i}
				{#if "divider" in item && item.divider}
					<li class="context-menu-divider"></li>
				{:else}
					<li class="context-menu-item">
						<button
							class="context-menu-button {!item.disabled ? 'cursor-pointer' : ''}"
							disabled={item.disabled}
							onclick={() => handleItemClick(item)}
						>
							{#if item.icon}
								<div class="context-menu-icon"><i class={item.icon}></i></div>
							{/if}
							<span class="context-menu-label">{item.label}</span>
							{#if item.shortcut}
								<span class="context-menu-shortcut">{item.shortcut}</span>
							{/if}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}