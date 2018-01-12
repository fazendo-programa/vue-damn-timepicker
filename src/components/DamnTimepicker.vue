<template>
	<div>
		<select v-model="dateHour">
			<option
				v-for='hour in hoursInDay'
				:key='hour'>
				{{ hour }}
			</option>
		</select>

		<select v-model="dateMinute">
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
			date: undefined,
			dateHour: undefined,
			dateMinute: undefined
		}
	},

	props: {
		// The picker timezone
		zone: {
			type: String,
			default: 'UTC'
		},

		// The earliest a time can be selected
		upperLimitISO: {
			type: String
		},

		// The latest a time can be selected
		lowerLimitISO: {
			type: String
		},

		// Step multiplier for the minutes
		minuteStep: {
			type: Number,
			default: 1
		}
	},

	computed: {
		/**
		 * Calculates the upper limit (earliest a time can be selected)
		 * based on the upperLimitISO prop.
		 * @return {DateTime}
		 */
		upperLimit() {
			return DateTime.fromISO(this.upperLimitISO, { zone: this.zone })
		},

		/**
		 * Calculates the lower limit (latest a time can be selected)
		 * based on the upperLimitISO prop.
		 * @return {DateTime}
		 */
		lowerLimit() {
			return DateTime.fromISO(this.lowerLimitISO, { zone: this.zone })
		},

		/**
		 * All hours in the day
		 * @return {Array<Integer>}
		 */
		hoursInDay() {
			let hours = this.integerArray(24)

			if (this.upperLimit.isValid) {
				const upperHour = this.upperLimit.hour
				hours = hours.filter(h => h <= upperHour)
			}

			if (this.lowerLimit.isValid) {
				const lowerHour = this.lowerLimit.hour
				hours = hours.filter(h => h >= lowerHour)
			}

			return hours
		},

		/**
		 * All minutes in the day
		 * @return {Array<Integer>}
		 */
		minutesInDay() {
			const minutes = this.integerArray(60)
			return minutes.filter(m => (m % this.minuteStep) === 0)

			// if (this.upperLimit.isValid) {

			// }

			// if (this.lowerLimit.isValid) {

			// }
		}
	},

	created() {
		var now = DateTime.local()
		this.date = now
		this.dateHour = now.hour
		this.dateMinute = now.minute
	},

	methods: {
		/**
		 * Returns an array filled with a sequence of integers,
		 * with the length of numberOfItems
		 * @param numberOfItems {Integer} Lenth of the array
		 *   in the array
		 * @param offset {Integer} By how much should each entry
		 *   be offset by
		 * @return {Array<Integer>}
		 */
		integerArray(numberOfItems, offset = 0) {
			return Array(numberOfItems).fill().map((x, i) => i + offset)
		},

		/**
		 * Returns the date's hour, unless it is not valid. In this
		 * case returns the first availalbe hour, using upperLimit to
		 * find that.
		 * @param  date {DateTime} Date to find the available hour for
		 * @return      {Integer}  Available hour for date
		 */
		findAvailableHour(date) {
			const thisHour  = date.hour
			const firstHour = this.upperLimit.hour
			const lastHour  = this.lowerLimit.hour

			if (firstHour != NaN && firstHour > thisHour) {
				return firstHour
			} else if (lastHour != NaN && lastHour < thisHour) {
				return lastHour
			} else {
				return thisHour
			}
		},
	}
}
</script>

<style scoped>
</style>
