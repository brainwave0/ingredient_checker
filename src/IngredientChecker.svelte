<svelte:options customElement="ingredient-checker" />
<script lang="ts">
  import comedogen_regexps from './comedogens.mjs';

  // split parenthesized items out of strings 
  function extract_parenthesized(ingredient: string): string[] {
    let items = ingredient.match(/\(.*?\)/g);
    let results = [ingredient.replace(/\(.*?\)/g, '').replace(/ +/g, ' ')];
    if (items) {
      results = results.concat(items.map(i => i.replace(/[()]/g, '')));
    }
    return results;
  }
  function find_comedogens(forbidden_ingredients: RegExp[], ingredients: string[]): string[] {
    return ingredients.filter(i => forbidden_ingredients.some(f => extract_parenthesized(i.replace(/(\*|†|‡)*/g, '')).some(j => f.test(j))));
  }
  let comedogens = $state([]);
  let input_box_text = $state('');
  function check(event) {
    input_box_text = event.target.value;
    if (!input_box_text) {
      comedogens = [];
    } else {
      comedogens = find_comedogens(comedogen_regexps, input_box_text.split(','));

      // The first two comedogens are a special case because they must both be present to be an issue.
      let [a, b] = [comedogens.find(c => comedogen_regexps[0].test(c)), comedogens.find(c => comedogen_regexps[1].test(c))];  // the two comedogens from `comedogens` if found, otherwise `undefined` for those that are not found
      if ((a === undefined) != (b === undefined)) {
        // only one is present
        comedogens = comedogens.filter(c => c != a && c != b);  // remove either ingredient
      } else if (a !== undefined && b !== undefined) {
        // both are present
        comedogens = comedogens.filter(c => c != a && c != b);  // remove both ingredients
        comedogens.push(`${a} + ${b}`);  // replace with combined result to emphasize their relationship
      }
  }
}
</script>
<style>
  label, textarea {
    letter-spacing: 1px;
  }
  textarea {
    padding: 10px;
    width: 100%;
    line-height: 1.5;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 1px #999;
    box-sizing: border-box;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }
  div#root {
    min-width: 5cm;
    max-width: 40cm;
    background-color: #292c30;
    padding: 2mm;
    color: white;
    font-family: sans-serif;
  }
  div#results {
    border: 0.5mm, solid, #727a85;
    margin-top: 2mm;
    padding: 2mm;
    min-height: 4cm;
  }
</style>
<div id="root">
  <label for="textarea">The ingredient list must be separated by commas.</label>
  <textarea id="textarea" placeholder="Paste ingredient list here." oninput={check} spellcheck="false" translate="no"></textarea>
  <div id="results">
    {#if input_box_text == ''}
      <p style="font-size: 1mm">...</p>
    {:else if comedogens.length == 0}
      <p>No pore-clogging ingredients found!</p>
    {:else}
      <p>The following ingredients can worsen acne:</p>
      <ul>
        {#each comedogens as ingredient}
          <li>{ingredient}</li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
