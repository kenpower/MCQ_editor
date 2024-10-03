<script>
  export let content = "This is an editable paragraph. Click to edit.";
  let contentEditableElement;
  // Function to handle the content change
  function updateContent(event) {
    content = event.target.innerText;
  }
</script>

<p
  contenteditable="true"
  on:input={updateContent}
  bind:this={contentEditableElement}
>
  {content}
</p>

<style>
  p {
    margin-top: 0;
    margin-bottom: 0.125em;
    padding: 0.125em;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: text;
  }

  p:focus {
    outline: none;
    border-color: #4caf50;
  }
</style>
