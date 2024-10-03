<script>
  import Question from "./Question.svelte";

  // Multiline input from the user
  let rawInput = localStorage.getItem("inputValue") || "";
  let mcqArray = []; // Parsed MCQ objects

  // Function to parse the input into mcq objects
  function parseInput() {
    mcqArray = rawInput
      .split("\n")
      .map((line) => {
        const parts = line.split("\t");
        if (parts.length >= 10) {
          return {
            type: parts[0],
            question: parts[1],
            answers: [
              { text: parts[2], isCorrect: parts[3] === "correct" },
              { text: parts[4], isCorrect: parts[5] === "correct" },
              { text: parts[6], isCorrect: parts[7] === "correct" },
              { text: parts[8], isCorrect: parts[9] === "correct" },
            ],
          };
        }
        return null; // If the line doesn't follow the expected format, return null
      })
      .filter((mcq) => mcq !== null); // Filter out null entries for invalid lines
  }

  // Function to update localStorage whenever the input value changes
  function handleInput(event) {
    rawInput = event.target.value;
    localStorage.setItem("inputValue", rawInput);
  }
</script>

<div class="mcq-parser">
  <textarea
    bind:value={rawInput}
    on:input={handleInput}
    placeholder="Paste MCQ lines here (TSV format)"
    rows="10"
    cols="50"
  ></textarea>

  <button on:click={parseInput}>Parse MCQs</button>

  {#if mcqArray.length > 0}
    <h3>Parsed MCQs:</h3>
    <ul>
      {#each mcqArray as mcq, index}
        <Question {mcq} {index} />
      {/each}
    </ul>
  {/if}
</div>

<style>
  .mcq-parser {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    font-family: inherit;
    padding: 10px;
  }

  button {
    margin-top: 10px;
    padding: 5px 15px;
    font-size: 1rem;
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    margin-bottom: 10px;
  }
</style>
