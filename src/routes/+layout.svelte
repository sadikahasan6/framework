<script lang="ts">
    import "../app.css";
      for (let i = 1; i <= 10; i++) {
    const className = `p-${i}`;
    if (!document.querySelector(`style[data-${className}]`)) {
      const style = document.createElement("style");
      style.setAttribute(`data-${className}`, "");
      style.innerHTML = `
        .${className} {
          padding: ${i * 0.25}rem ${i * 0.5}rem;
        }
      `;
      document.head.appendChild(style);
    }
  }
</script>


<svelte:head>
    <title>Svelte UI Framework</title>
    <meta name="description" content="A POS system for businesses." />
</svelte:head>

<slot />