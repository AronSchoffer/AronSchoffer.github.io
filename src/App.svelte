<script>
	import Logger from './logger/Logger.svelte';
	import Map from './Map.svelte';
	
	if (localStorage.getItem('logId') === null) localStorage.setItem('logId', 0);
</script>

<main>
	<Map/>
	<Logger/>
</main>

<style>
	:global(body) {
		padding: 0;
		margin: 0;
	}
	:global(html, body, main) {
		height: 100%;
		width: 100vw;
	}
</style>
