<script lang="ts">
  export let padding = 1;

  // Generate a class and inject it once
  const className = `p-${padding}`;
  if (!document.querySelector(`style[data-${className}]`)) {
    const style = document.createElement("style");
    style.setAttribute(`data-${className}`, "");
    style.innerHTML = `
      .${className} {
        padding: ${padding * 0.25}rem ${padding * 0.5}rem;
      }
    `;
    document.head.appendChild(style);
  }
</script>

<div class={className}>
  Padding class: {className}
</div>
