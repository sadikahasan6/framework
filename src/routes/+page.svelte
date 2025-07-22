<script lang="ts">
	import Accordion from '$lib/components/ui/accordion.svelte';
	import Alert from '$lib/components/ui/alert.svelte';
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
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
</p>
<Button type="button" size="md" variant="default">Button</Button>

<div style="padding: 15px;">
	<Accordion items={faq} />
</div>

<Calendar onSelect={handleDateSelect} />
Selected date: {date ? date.toDateString() : "None"}

<div class="" style="width: 350px;">
  <Alert
      title="Success"
      variant="success"
      message="This is a success alert!"
    />
    <Alert variant="error" title="Error" message="This is an error alert!" />
    <Alert
      title="Warning"
      variant="warning"
      message="This is a warning alert!"
    />
    <Alert title="Hey there!" message="This is a default alert." />
</div>