<script>
	import Logger from './logger/Logger.svelte';
	import Map from './Map.svelte';
	
	if (localStorage.getItem('logId') === null) localStorage.setItem('logId', 0);
</script>

<main>
	<Map/>
	<Logger/>
</main>
