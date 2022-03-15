<script>
  import Buttons from './Buttons.svelte';
  import Feedback from './Feedback.svelte';
</script>

<div id="logger-container">
  <Buttons/>
  <Feedback/>
</div>

<style>
  div {
    height: 20%;
    width: 100%;
    background-color: #e0e0e0;
    display: flex;
    flex-direction: column;
  }
</style>
