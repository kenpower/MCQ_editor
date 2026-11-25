<script>
  import { onMount } from "svelte";

  export let content = "This is an editable paragraph. Click to edit.";
  export let textUpdate = () => {};
  export let autofocus = false;

  let contentEditableElement;
  let editing = false;

  // escape everything, then re-allow a small set of formatting tags
  const toSafeHtml = (text) =>
    (text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /&lt;(\/?)(code|pre|b|i|em|strong|u|sub|sup)&gt;/gi,
        "<$1$2>"
      )
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>");

  function updateContent(event) {
    content = event.target.textContent;
    textUpdate();
  }

  function startEditing() {
    editing = true;
    contentEditableElement.textContent = content;
  }

  function stopEditing() {
    editing = false;
  }

  function focusIfRequested() {
    if (autofocus && contentEditableElement) contentEditableElement.focus();
  }

  onMount(focusIfRequested);

  $: if (contentEditableElement && !editing) {
    contentEditableElement.innerHTML = toSafeHtml(content);
  }

  $: if (autofocus) focusIfRequested();
</script>

<p
  bind:this={contentEditableElement}
  contenteditable="true"
  on:focus={startEditing}
  on:blur={stopEditing}
  on:input={updateContent}
  spellcheck="true"
></p>

<style>

  p :global(pre) {
    background: #f4f4f4;
    padding: 0.5em;
    margin: 0.25em 0;
    overflow-x: auto;
    white-space: pre;
  }

  p :global(code) {
    font-family: monospace;
    background: #f4f4f4;
    padding: 0 0.2em;
  }

  p :global(pre code) {
    background: none;
    padding: 0;
  }
</style>
