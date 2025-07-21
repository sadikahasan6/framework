<script>
  import Accordion from "$lib/components/ui/accordion.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import Calendar from "$lib/components/ui/calender.svelte";


  const faq = [
    { title: "What is Auronno POS?", content: "A POS system for businesses." },
    { title: "Is it free?", content: "Yes, it has a free tier." },
    {
      title: "Can I use it offline?",
      content: "Partially – depends on setup.",
    },
  ];
  // let date: Date | null = null;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
<Button type="button" size="md" variant="outline">Button</Button>

<div style="padding: 15px;">
	<Accordion items={faq} />
</div>

<Calendar />
<!-- Selected date: {date?.toDateString() || "None"} -->
