<script lang="ts">
	import Accordion from '$lib/components/ui/accordion.svelte';
	import Alert from '$lib/components/ui/alert.svelte';
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Calendar from '$lib/components/ui/calender.svelte';

	const faq = [
		{ title: 'What is Auronno POS?', content: 'A POS system for businesses.' },
		{ title: 'Is it free?', content: 'Yes, it has a free tier.' },
		{
			title: 'Can I use it offline?',
			content: 'Partially – depends on setup.'
		}
	];

	let date: Date | null = null;

	// Function to handle date selection from Calendar component
	function handleDateSelect(newDate: Date) {
		date = newDate;
	}

	  const crumbs = [
    { title: "Home", href: "/" },
    {
      title: "Library",
      children: [
        { title: "Articles", href: "/library/articles" },
        { title: "Videos", href: "/library/videos" },
      ],
    },
    { title: "Current Page" },
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
</main>

<style>
	.flex-col {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.example {
		display: flex;
		min-height: 100px;
		align-items: center;
		background-color: white;
		justify-content: center;
		gap: 20px;
		padding: 20px;
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
