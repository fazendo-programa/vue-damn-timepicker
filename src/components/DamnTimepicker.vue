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
		earlyLimitISO: {
			type: String
		},

		// The latest a time can be selected
		lateLimitISO: {
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
		 * Calculates the early limit based on the
		 * earlyLimitISO prop.
		 * @return {DateTime}
		 */
		earlyLimit() {
			return DateTime.fromISO(this.earlyLimitISO, { zone: this.zone })
		},

		/**
		 * Calculates the late limit based on the
		 * lateLimitISO prop.
		 * @return {DateTime}
		 */
		lateLimit() {
			return DateTime.fromISO(this.lateLimitISO, { zone: this.zone })
		},

		/**
		 * All hours in the day
		 * @return {Array<Integer>}
		 */
		hoursInDay() {
			let hours = this.integerArray(24)

			if (this.earlyLimit.isValid) {
				const earlyHour = this.earlyLimit.hour
				hours = hours.filter(h => h >= earlyHour)
			}

			if (this.lateLimit.isValid) {
				const lateHour = this.lateLimit.hour
				hours = hours.filter(h => h <= lateHour)
			}

			return hours
		},

		/**
		 * All minutes in the day
		 * @return {Array<Integer>}
		 */
		minutesInDay() {
			let minutes = this.possibleMinutes(60, this.minuteStep)

			// if (this.earlyLimit.isValid && this.date.hour === this.earlyLimit.hour) {
			// 	minutes = minutes.filter(m => m > this.earlyLimit.minute)
			// }

			// if (this.lateLimite.isValid && this.date.hour === this.lateLimit.hour) {
			// 	minutes = minutes.filter(m => m < this.lateLimit.minute)
			// }

			return minutes
		}
	},

	created() {
		var now = DateTime.local()
		this.date = now
		this.dateHour = this.findAvailableHour(now)
		this.dateMinute = this.findAvailableMinute(now)
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
		 * All possible minutes, given the number of
		 * minutes and the step size.
		 * @param   minutes {Number} Number of minutes
		 *                             to calculate
		 * @param  step     {Number} Step size
		 * @return {Array<Number>}
		 */
		possibleMinutes(minutes, step) {
			return this.integerArray(minutes)
				.filter(m => (m % step) === 0)
		},

		/**
		 * Returns the date's hour, unless it is not valid. In this
		 * case returns the first availalbe hour, using limits to
		 * find that.
		 * @param  date {DateTime} Date to find the available hour for
		 * @return      {Integer}  Available hour for date
		 */
		findAvailableHour(date) {
			const thisHour = date.hour
			const earlyHour = this.earlyLimit.hour
			const lateHour = this.lateLimit.hour

			if (!isNaN(earlyHour) && earlyHour > thisHour) {
				return earlyHour
			} else if (!isNaN(lateHour) && lateHour < thisHour) {
				return lateHour
			} else {
				return thisHour
			}
		},

		/**
		 * Returns the date's minute, unless it is not valid. In this
		 * caes returns the first available minute, using limits to
		 * find that.
		 * @param  date {DateTime} Date to find the available minute for
		 * @return      {Integer|Boolean}  Available minute for date,
		 *                                   false if date has no possible
		 *                                   available minute.
		 */
		findAvailableMinute(date) {
			const thisHour = date.hour
			const earlyHour = this.earlyLimit.hour
			const lateHour = this.lateLimit.hour

			const thisMinute = date.minute
			const firstMinute = this.earlyLimit.minute
			const lastMinute = this.lateLimit.minute

			let minute = null
			if (thisHour > earlyHour && lateHour > thisHour) {
				return thisMinute
			} else if (earlyHour === thisHour && firstMinute > thisMinute) {
				return firstMinute
			} else if (earlyHour === thisHour && firstMinute < thisMinute) {
				return thisMinute
			} else if (lateHour === thisHour && lastMinute < thisMinute) {
				return lastMinute
			} else if (lateHour === thisHour && lastMinute > thisMinute) {
				return thisMinute
			} else {
				return thisMinute
			}
		}
	}
}
</script>

<style scoped>
</style>
