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
	import Switch from '$lib/components/ui/switch.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Tabs } from '$lib/components/ui/tabs/index.js';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import Div from '$lib/styles/div.svelte';
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
	const invoices = [
		{
			invoice: 'INV001',
			paymentStatus: 'Paid',
			totalAmount: '$250.00',
			paymentMethod: 'Credit Card'
		},
		{
			invoice: 'INV002',
			paymentStatus: 'Pending',
			totalAmount: '$150.00',
			paymentMethod: 'PayPal'
		},
		{
			invoice: 'INV003',
			paymentStatus: 'Unpaid',
			totalAmount: '$350.00',
			paymentMethod: 'Bank Transfer'
		},
		{
			invoice: 'INV004',
			paymentStatus: 'Paid',
			totalAmount: '$450.00',
			paymentMethod: 'Credit Card'
		},
		{
			invoice: 'INV005',
			paymentStatus: 'Paid',
			totalAmount: '$550.00',
			paymentMethod: 'PayPal'
		},
		{
			invoice: 'INV006',
			paymentStatus: 'Pending',
			totalAmount: '$200.00',
			paymentMethod: 'Bank Transfer'
		},
		{
			invoice: 'INV007',
			paymentStatus: 'Unpaid',
			totalAmount: '$300.00',
			paymentMethod: 'Credit Card'
		}
	];
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
			<Button variant="outline">Hover me (top)</Button>
		</Tooltip>

		<Tooltip text="Bottom positioned tooltip" position="bottom">
			<Button variant="outline">Bottom tooltip</Button>
		</Tooltip>

		<Tooltip text="Left positioned tooltip" position="left">
			<Button variant="outline">Left tooltip</Button>
		</Tooltip>

		<Tooltip text="Right positioned tooltip" position="right">
			<Button variant="outline">Right tooltip</Button>
		</Tooltip>
	</div>
	<div class="example">
		<Button
			variant="outline"
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
		<Toaster closeButton position="top-center" />
	</div>
	<div class="example">
		<Switch id="airplane-mode" />
		<Label forId="airplane-mode">Airplane Mode</Label>
	</div>

	<div class="example">
		<div class="" style="width: 40rem;">
			<Table.Root>
				<Table.Caption>A list of your recent invoices.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head style="width: 100px;">Invoice</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Method</Table.Head>
						<Table.Head style="text-align: right;">Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each invoices as invoice (invoice)}
						<Table.Row>
							<Table.Cell style="font-weight: 500;">{invoice.invoice}</Table.Cell>
							<Table.Cell>{invoice.paymentStatus}</Table.Cell>
							<Table.Cell>{invoice.paymentMethod}</Table.Cell>
							<Table.Cell style="text-align: right;">{invoice.totalAmount}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell colspan={3}>Total</Table.Cell>
						<Table.Cell style="text-align: right;">$2,500.00</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</div>
	</div>
	<div class="example">
		<div class="w-30">
			<Tabs.Root value="account" class="w-[400px]">
				<Tabs.List>
					<Tabs.Trigger value="account">Account</Tabs.Trigger>
					<Tabs.Trigger value="password">Password</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
				<Tabs.Content value="password">Change your password here.</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
	<div class="example">
		<div class="flex-col">
			<Skeleton style="height: 50px; width: 50px; border-radius: 99999px;" />
		</div>
		<div class="flex-col" style="gap:7px">
			<Skeleton style="height: 16px; width: 300px; border-radius: 15px;" />
			<Skeleton style="height: 16px; width: 250px; border-radius: 15px;" />
		</div>
	</div>
	<div class="example">
		<Avatar src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg" alt="User Dvatar" className="custom-class" />
		<Avatar src="" alt="User Dvatar" className="custom-class" />
	</div>
	<div class="example">
		<div class="p-10" style="background-color: #f0f0f0; border-radius: 8px;">
			<p>This div has a padding of 2.</p>
		</div>
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
