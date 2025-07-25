<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	type BreadcrumbItem = {
		title: string;
		href?: string;
		children?: BreadcrumbItem[];
	};

	export let items: BreadcrumbItem[] = [];

	let openDropdownIndex: number | null = null;

	const toggleDropdown = (index: number) => {
		openDropdownIndex = openDropdownIndex === index ? null : index;
	};

	const closeDropdown = () => {
		openDropdownIndex = null;
	};
</script>

<nav class="breadcrumb-nav" aria-label="Breadcrumb">
	<ol class="breadcrumb-list">
		{#each items as item, i}
			<li class="breadcrumb-item">
				{#if i !== 0}
					<svg
						class="breadcrumb-separator"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				{/if}

				{#if item.children}
					<button
						type="button"
						class="breadcrumb-dropdown-btn"
						on:click={() => toggleDropdown(i)}
						on:blur={closeDropdown}
					>
						{item.title}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							class="breadcrumb-dropdown-icon"
							{...$$props}
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
							/>
						</svg>
					</button>

					{#if openDropdownIndex === i}
						<ul
							class="breadcrumb-dropdown"
							on:mouseleave={closeDropdown}
							in:scale={{ start: 0.95, duration: 150 }}
							out:scale={{ start: 0.95, duration: 100 }}
						>
							{#each item.children as child}
								<li>
									<a
										href={child.href}
										class="breadcrumb-dropdown-link"
										rel={child.href && !child.href.startsWith('/')
											? 'noopener noreferrer'
											: undefined}
										target={child.href && !child.href.startsWith('/') ? '_blank' : undefined}
									>
										{child.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				{:else if item.href && i !== items.length - 1}
					<a href={item.href} class="breadcrumb-link">{item.title}</a>
				{:else}
					<span class="breadcrumb-current">{item.title}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.breadcrumb-nav {
		width: auto;
	}

	.breadcrumb-list {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.95rem;
		color: #555;
		font-weight: 500;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.breadcrumb-item {
		position: relative;
		display: flex;
		align-items: center;
	}

	.breadcrumb-separator {
		margin: 0 0.5em;
		height: 1em;
		width: 1em;
		color: #222;
	}

	.breadcrumb-link {
		color: #555;
		text-decoration: none;
		transition: color 0.2s;
		cursor: pointer;
	}
	.breadcrumb-link:hover {
		color: #000;
	}

	.breadcrumb-dropdown-btn {
		background: none;
		border: none;
		color: #555;
		cursor: pointer;
		display: flex;
		align-items: center;
		font: inherit;
		padding: 0;
		transition: color 0.2s;
	}
	.breadcrumb-dropdown-btn:hover {
		color: #000;
	}

	.breadcrumb-dropdown-icon {
		margin-left: 0.3em;
	}

	.breadcrumb-dropdown {
		position: absolute;
		list-style: none;
		left: 0;
		top: 100%;
		margin-top: 0.3em;
		min-width: 160px;
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: var(--border-radius);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		z-index: 10;
		padding: 0.3em 0.3em;
	}

	.breadcrumb-dropdown-link {
		display: block;
		padding: 0.5em 1em;
		color: #333;
		text-decoration: none;
		border-radius: var(--border-radius);
		font-size: 0.95em;
		transition: background 0.15s;
	}
	.breadcrumb-dropdown-link:hover {
		background: #f5f5f5;
	}

	.breadcrumb-current {
		color: #222;
	}
</style>
