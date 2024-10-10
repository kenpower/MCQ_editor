<script>
  export let content = "This is an editable paragraph. Click to edit.";
  export let textUpdate = () => {};

  let contentEditableElement;

  // Function to handle the content change
  function updateContent(event) {
    content = event.target.innerText;
    console.log("editable text update", content);
    textUpdate();
  }
</script>

<p contenteditable="true" on:input={updateContent} spellcheck="true">
  {content}
</p>

<style>
  p {
    margin-top: 0;
    margin-bottom: 0.125em;
    padding: 0.125em;
    font-size: 1rem;
    cursor: text;
  }

  p:focus,
  p:hover {
    outline: none;
    border-color: #4caf50;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
