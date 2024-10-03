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
    padding: 10px;
    font-size: 1.1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-height: 40px;
    cursor: text;
  }

  p:focus {
    outline: none;
    border-color: #4caf50;
  }
</style>
