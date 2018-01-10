<template>
	<div>
		<select>
			<option
				v-for='hour in hoursInDay'
				:key='hour'>
				{{ hour }}
			</option>
		</select>

		<select>
			<option
				v-for='minute in minutesInDay'
				:key='minute'>
				{{ minute }}
			</option>
		</select>
	</div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
	name: 'DamnTimepicker',
	data() {
		return {
			date: DateTime.local()
		}
	},

	props: {
		// The earliest a time can be selected
		upperLimitISO: {
			type: String,
			required: false
		},

		// The latest a time can be selected
		lowerLimitISO: {
			type: String,
			required: false
		}
	},

	computed: {
		/**
		 * Calculates the upper limit (earliest a time can be selected)
		 * based on the upperLimitISO prop.
		 * @return {DateTime}
		 */
		upperLimit() {
			return DateTime.fromISO(this.upperLimitISO)
		},

		/**
		 * Calculates the lower limit (lates a time can be selected)
		 * based on the upperLimitISO prop.
		 * @return {DateTime}
		 */
		lowerLimit() {
			return DateTime.fromISO(this.lowerLimitISO)
		},

		/**
		 * All hours in the day
		 * @return {Array<Integer>}
		 */
		hoursInDay() {
			const hours = this.integerArray(24)
			return hours
		},

		/**
		 * All minutes in the day
		 * @return {Array<Integer>}
		 */
		minutesInDay() {
			const minutes = this.integerArray(60)
			return minutes
		}
	},

	methods: {
		/**
		 * Returns an array filled with a sequence of integers,
		 * with the length of numberOfItems
		 * @param numberOfItems {Integer} Lenth of the array
		 *   in the array
		 * @return {Array<Integer>}
		 */
		integerArray(numberOfItems) {
			return Array(numberOfItems).fill().map((x, i) => i + 1)
		}
	}
}
</script>

<style scoped>
</style>
