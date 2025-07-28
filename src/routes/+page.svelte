<script lang="ts">
	import Accordion from '$lib/components/ui/accordion.svelte';
	import AlertDialog from '$lib/components/ui/alert-dialog.svelte';
	import Alert from '$lib/components/ui/alert.svelte';
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Calendar from '$lib/components/ui/calendar.svelte';
	import Checkbox from '$lib/components/ui/checkbox.svelte';
	import Combobox from '$lib/components/ui/combobox.svelte';
	import ContextMenu from '$lib/components/ui/context-menu.svelte';
	import DatePicker from '$lib/components/ui/date-picker.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
	import Tooltip from '$lib/components/ui/tooltip.svelte';
	import { Toaster, toast } from '$lib/components/ui/sonner/index';
	let value = $state([25, 75]);
	let value2 = $state([25, 75]);
	let value3 = $state([10]);
	let singleValue = $state([25]);

	const faq = [
		{ title: 'What is Auronno POS?', content: 'A POS system for businesses.' },
		{ title: 'Is it free?', content: 'Yes, it has a free tier.' },
		{
			title: 'Can I use it offline?',
			content: 'Partially – depends on setup.'
		}
	];

	// let date: Date | null = null;
	let date: Date | null = $state(null);

	// Function to handle date selection from Calendar component
	function handleDateSelect(newDate: Date) {
		date = newDate;
	}

	const crumbs = [
		{ title: 'Home', href: '/' },
		{
			title: 'Library',
			children: [
				{ title: 'Articles', href: '/library/articles' },
				{ title: 'Videos', href: '/library/videos' }
			]
		},
		{ title: 'Current Page' }
	];
	let selectedFruit: string | null = null;

	let openModal = $state(false);

	const handleConfirm = () => {
		console.log('Confirmed!');
		openModal = false; // Close modal after confirmation
	};

	const handleCancel = () => {
		console.log('Cancelled!');
		openModal = false; // Close modal after cancellation
	};

	let selectedItem = '';
	let contextMenuVisible = $state(false);
	let contextMenuX = $state(0);
	let contextMenuY = $state(0);

	// Define the menu item type to match the component
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
				shortcut?: never;
				action?: never;
				disabled?: never;
		  };

	const menuItems: MenuItem[] = [
		{
			label: 'Copy',
			icon: 'fas fa-copy',
			action: () => {
				selectedItem = 'Copy';
				console.log('Copy action');
			}
		},
		{
			label: 'Cut',
			icon: 'fas fa-cut',
			action: () => {
				selectedItem = 'Cut';
				console.log('Cut action');
			}
		},
		{
			label: 'Paste',
			icon: 'fas fa-paste',
			action: () => {
				selectedItem = 'Paste';
				console.log('Paste action');
			}
		},
		{ divider: true },
		{
			label: 'Download',
			icon: 'fas fa-download',
			action: () => {
				selectedItem = 'Download';
				console.log('Download action');
			}
		},
		{
			label: 'Share',
			icon: 'fas fa-share',
			action: () => {
				selectedItem = 'Share';
				console.log('Share action');
			}
		},
		{ divider: true },
		{
			label: 'Edit',
			icon: 'fas fa-edit',
			action: () => {
				selectedItem = 'Edit';
				console.log('Edit action');
			}
		},
		{
			label: 'View Details',
			icon: 'fas fa-eye',
			action: () => {
				selectedItem = 'View Details';
				console.log('View Details action');
			}
		},
		{ divider: true },
		{
			label: 'Delete',
			icon: 'fas fa-trash',
			action: () => {
				selectedItem = 'Delete';
				console.log('Delete action');
			}
		}
	];

	const fileMenuItems: MenuItem[] = [
		{
			label: 'New File',
			icon: 'fas fa-file-plus',
			action: () => {
				selectedItem = 'New File';
				console.log('New File action');
			},
			shortcut: 'Ctrl+N'
		},
		{
			label: 'New Folder',
			icon: 'fas fa-folder-plus',
			action: () => {
				selectedItem = 'New Folder';
				console.log('New Folder action');
			}
		},
		{ divider: true },
		{
			label: 'Refresh',
			icon: 'fas fa-refresh',
			action: () => {
				selectedItem = 'Refresh';
				console.log('Refresh action');
			},
			shortcut: 'F5'
		}
	];

	let currentMenuItems: MenuItem[] = $state(menuItems);

	function handleContextMenu(event: MouseEvent, items: MenuItem[]) {
		event.preventDefault();
		event.stopPropagation();

		contextMenuX = event.clientX;
		contextMenuY = event.clientY;
		currentMenuItems = items;
		contextMenuVisible = true;
	}

	function handleCloseContextMenu() {
		contextMenuVisible = false;
	}
	let showToast = $state(false);
</script>

<main>
	<div class="example flex-col">
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
	</div>
	<div class="example">
		<Button type="button" size="md" variant="default">Medium size</Button>
		<Button type="button" size="lg" variant="default">Large size</Button>
		<Button type="button" size="sm" variant="default">Small size</Button>
		<Button type="button" size="md" variant="destructive">Small size</Button>
		<Button type="button" size="md" variant="link">Small size</Button>
		<Button type="button" size="md" variant="outline">Small size</Button>
		<Button type="button" size="md" variant="ghost">Small size</Button>
		<Button type="button" size="md" variant="default" isLoading>Loading</Button>
		<Button type="button" size="md" variant="default" disabled>Disabled</Button>
	</div>

	<div class="example">
		<Accordion items={faq} />
	</div>

	<div class="example flex-col">
		<Calendar onSelect={handleDateSelect} />
		Selected date: {date ? date.toDateString() : 'None'}
	</div>

	<div class="example flex-col">
		<div class="w-30">
			<Alert title="Success" variant="success" message="This is a success alert!" />
			<Alert variant="error" title="Error" message="This is an error alert!" />
			<Alert title="Warning" variant="warning" message="This is a warning alert!" />
			<Alert title="Hey there!" message="This is a default alert." />
		</div>
	</div>
	<div class="example">
		<Breadcrumb items={crumbs} />
	</div>

	<div class="example">
		<Combobox
			options={['Apple', 'Banana', 'Cherry', 'Durian']}
			placeholder="Pick a fruit..."
			value={selectedFruit}
			searchPlaceholder="Search fruit..."
		/>
	</div>
	<div class="example">
		<Button type="button" disabled={false} variant="outline" on:click={() => (openModal = true)}
			>Alert Dialog</Button
		>
		<AlertDialog
			open={openModal}
			title="Delete Item"
			message="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
			onConfirm={handleConfirm}
			onCancel={handleCancel}
		/>
	</div>
	<div
		class="example"
		oncontextmenu={(e) => handleContextMenu(e, menuItems)}
		role="button"
		tabindex="0"
	>
		Right click to open context menu
		<ContextMenu
			items={currentMenuItems}
			x={contextMenuX}
			y={contextMenuY}
			bind:visible={contextMenuVisible}
			close={handleCloseContextMenu}
		/>
	</div>
	<div class="example">
		<DatePicker />
	</div>
	<div class="example">
		<div class="w-30 flex-col">
			<Label forId="email">Your email address</Label>
			<Input name="email" id="email" type="email" placeholder="email" />
			<Input type="text" placeholder="disabled" disabled />
			<Input type="email" placeholder="framework@svelte" aria-invalid />
			<Input type="file" placeholder="email" />
		</div>
	</div>
	<div class="example">
		<Checkbox id="terms" />
		<Label forId="terms">Accept terms and conditions</Label>
	</div>
	<div class="example">
		<div class="w-30">
			<div style="display: flex; gap: 20px;">
				<Slider type="multiple" orientation="vertical" bind:value max={100} step={1} />
				<Slider type="single" orientation="vertical" bind:value={singleValue} max={100} step={1} />
				<div class="w-30 flex-col">
					<Slider type="multiple" orientation="horizontal" bind:value={value3} max={100} step={1} />
					<Slider type="single" orientation="horizontal" bind:value={value2} max={100} step={1} />
				</div>
			</div>
		</div>
	</div>
	<div class="example">
		<Tooltip text="This is a simple tooltip">
			<button class="btn">Hover me (top)</button>
		</Tooltip>

		<Tooltip text="Bottom positioned tooltip" position="bottom">
			<button class="btn">Bottom tooltip</button>
		</Tooltip>

		<Tooltip text="Left positioned tooltip" position="left">
			<button class="btn">Left tooltip</button>
		</Tooltip>

		<Tooltip text="Right positioned tooltip" position="right">
			<button class="btn">Right tooltip</button>
		</Tooltip>
	</div>
	<div class="example">
		<Button
			on:click={() =>
				toast.success('Event has been created', {
					description: 'Sunday, December 03, 2023 at 9:00 AM',
					action: {
						label: 'Undo',
						onClick: () => console.info('Undo')
					}
				})}
		>
			Give me a toast
		</Button>
		<Toaster closeButton position="top-center"/>
	</div>
</main>

<style>
	.flex-col {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.example {
		display: flex;
		min-height: 50px;
		align-items: center;
		background-color: white;
		justify-content: center;
		gap: 15px;
		padding: 20px;
		min-height: 450px;
		/* background-color: #f9f9f9; */
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin: 30px;
	}
	.w-30 {
		width: 30rem;
	}
</style>
