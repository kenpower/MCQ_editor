<script>
  import { parse } from "svelte/compiler";
  import Question from "./Question.svelte";

  // Multiline input from the user
  let rawInput = localStorage.getItem("inputValue") || "";
  let mcqArray = [];

  function loadMcqArray() {
    const storedData = localStorage.getItem("mcqArray");
    try {
      mcqArray = JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing mcqArray from localStorage:", error);
      mcqArray = []; // If parsing fails, fall back to an empty array
    }
  }

  loadMcqArray();

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
            answers: parts.slice(2).reduce((acc, val, index, array) => {
              // We process each pair of elements, i.e., (text, correctness)
              if (index % 2 === 0) {
                acc.push({
                  text: val,
                  isCorrect: array[index + 1] === "correct",
                });
              }
              return acc;
            }, []),
          };
        }
        return null; // If the line doesn't follow the expected format, return null
      })
      .filter((mcq) => mcq !== null); // Filter out null entries for invalid lines
  }

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const shuffle_answers = (mcqArray) => {
    mcqArray.forEach((mcq) => (mcq.answers = shuffle(mcq.answers)));
  };

  const mcqChanged = (mcq, index) => {
    mcqArray[index] = mcq;
    saveChanges(mcqArray);
  };

  const deleteQuestion = (index) => {
    console.log("deleteQuestion", index);
    mcqArray.splice(index, 1);
    saveChanges();
  };

  function saveChanges() {
    localStorage.setItem("mcqArray", JSON.stringify(mcqArray)); // Save to localStorage
    mcqArray = [...mcqArray]; // Trigger reactivity
  }
  const process_input = () => {
    parseInput();
    shuffle_answers(mcqArray);

    saveChanges();
  };
  // Function to update localStorage whenever the input value changes
  function handleInput(event) {
    rawInput = event.target.value;
    localStorage.setItem("inputValue", rawInput);
  }

  const save_output_as_tsv = () => {
    let output = mcqArray
      .map((mcq) => {
        const answers = mcq.answers
          .map(
            (answer) =>
              `${answer.text}\t${answer.isCorrect ? "correct" : "incorrect"}`
          )
          .join("\t");
        return `${mcq.type}\t${mcq.question}\t${answers}`;
      })
      .join("\n");

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `mcqs_${dateTime}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };
</script>

<div class="mcq-parser">
  <textarea
    bind:value={rawInput}
    on:input={handleInput}
    placeholder="Paste MCQ lines here (TSV format)"
    rows="10"
    cols="50"
  ></textarea>

  <button on:click={process_input}>Parse MCQs</button>

  {#if mcqArray.length > 0}
    <h3>Parsed MCQs:</h3>
    <ul>
      {#each mcqArray as mcq, index}
        <Question {mcq} {index} {mcqChanged} {deleteQuestion} />
      {/each}
    </ul>
  {/if}

  <button on:click={save_output_as_tsv}>Save MCQs</button>
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
    background-color: gainsboro;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li {
    margin-bottom: 10px;
  }
</style>
