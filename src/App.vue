<template>
	<div id="app">
		<DamnTimepicker
			:minuteStep="15"
			:upperLimitISO="'2018-01-11T20:00:00.000Z'"
			:lowerLimitISO="'2018-01-1109:00:00.000Z'" />
	</div>
</template>

<script>
import DamnTimepicker from './components/DamnTimepicker'

export default {
	name: 'app',
	components: {
		DamnTimepicker
	}
}
</script>

<style>
</style>
