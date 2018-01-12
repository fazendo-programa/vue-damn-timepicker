import Vue from 'vue'
import { DateTime } from 'luxon'
import DamnTimepicker from '@/components/DamnTimepicker'

describe('DamnTimepicker.vue', () => {
	let Constructor
	let vm

	beforeEach(() => {
		Constructor = Vue.extend(DamnTimepicker)
		vm = new Constructor().$mount()
	})

	describe('#earlyLimit', () => {
		it('parses a valid ISO string', () => {
			const ISOString = '2018-01-09T09:00:00.000Z'
			vm = vmWithProps({ earlyLimitISO: ISOString })

			expect(vm.earlyLimit.isValid).toEqual(true)
			expect(vm.earlyLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			vm = vmWithProps({ earlyLimitISO: undefined })
			expect(vm.earlyLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			vm = vmWithProps({ earlyLimitISO: 'abc' })
			expect(vm.earlyLimit.isValid).toEqual(false)
		})
	})

	describe('#lateLimit', () => {
		it('parses a valid ISO string', () => {
			const ISOString = '2018-01-09T09:00:00.000Z'
			vm = vmWithProps({ lateLimitISO: ISOString })

			expect(vm.lateLimit.isValid).toEqual(true)
			expect(vm.lateLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			vm = vmWithProps({ lateLimitISO: undefined })
			expect(vm.lateLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			vm = vmWithProps({ lateLimitISO: 'abc' })
			expect(vm.lateLimit.isValid).toEqual(false)
		})
	})

	describe('#hoursInDay', () => {
		it('has a list of all hours in day', () => {
			const hours = vm.hoursInDay
			expect(hours.length).toEqual(24)
		})

		it('filters by earlyLimit', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T17:00:00.000Z' })

			expect(vm.hoursInDay.length).toEqual(7)
			expect(vm.hoursInDay).toEqual([17,18,19,20,21,22,23])
		})

		it('filters by lateLimit', () => {
			vm = vmWithProps({ lateLimitISO: '2018-01-11T06:00:00.000Z' })

			expect(vm.hoursInDay.length).toEqual(7)
			expect(vm.hoursInDay).toEqual([0,1,2,3,4,5,6])
		})

		it('does not break for invalid earlyLimitISO', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T7:00:00.000Z' })
			expect(vm.hoursInDay.length).toEqual(24)
		})

		it('does not break for invalid lateLimitISO', () => {
			vm = vmWithProps({ lateLimitISO: '2018-01-11T7:00:00.000Z' })
			expect(vm.hoursInDay.length).toEqual(24)
		})
	})

	describe('#minutesInDay', () => {
		it('has a list of all minutes in day', () => {
			const minutes = vm.minutesInDay
			expect(minutes.length).toEqual(60)
		})

		it('filters by the minute step', () => {
			vm = vmWithProps({ minuteStep: 10 })

			expect(vm.minutesInDay.length).toEqual(6)
			expect(vm.minutesInDay).toEqual([0,10,20,30,40,50])
		})
	})

	describe('#integerArray', () => {
		it('returns an array of integers', () => {
			const integers = vm.integerArray(5)
			expect(integers).toEqual([0,1,2,3,4])
		})

		it('accepts an offset', () => {
			const integers = vm.integerArray(5, 5)
			expect(integers).toEqual([5,6,7,8,9])
		})
	})

	describe('#possibleMinutes', () => {
		it('lists all minutes', () => {
			const minutes = vm.possibleMinutes(60, 1)
			expect(minutes.length).toEqual(60)
		})

		it('applies a minute step', () => {
			const minutes = vm.possibleMinutes(60, 10)

			expect(minutes.length).toEqual(6)
			expect(minutes).toEqual([0,10,20,30,40,50])
		})
	})

	describe('#findAvailableHour', () => {
		it('returns the date\'s hour if limit', () => {
			const date = DateTime.local()
			const hour = vm.findAvailableHour(date)

			expect(hour).toEqual(date.hour)
		})

		it('returns the early limit hour if invalid', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T09:00:00.000Z' }) // 9AM
			const date = DateTime.fromISO('2018-01-11T08:00:00.000Z', { zone: vm.zone }) // 8AM
			const hour = vm.findAvailableHour(date)

			expect(hour).toEqual(vm.earlyLimit.hour)
		})

		it('returns the late limit hour if invialid', () => {
			vm = vmWithProps({ lateLimitISO: '2018-01-11T21:00:00.000Z' }) // 9PM
			const date = DateTime.fromISO('2018-01-11T22:00:00.000Z', { zone: vm.zone }) // 10PM
			const hour = vm.findAvailableHour(date)

			expect(hour).toEqual(vm.lateLimit.hour)
		})

		it('returns the date\'s hour if valid', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T08:00:00.000Z' }) // 8AM
			const date = DateTime.fromISO('2018-01-11T09:00:00.000Z', { zone: vm.zone }) // 9AM
			const hour = vm.findAvailableHour(date)

			expect(hour).toEqual(date.hour)
		})
	})

	describe('#findAvailableMinute', () => {
		it('returns the date\'s minute if no limit', () => {
			const date = DateTime.fromISO('2018-01-11T09:15:00.000Z', { zone: vm.zone }) // 9:15AM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(date.minute)
		})

		it('returns the early limit minute if same hour and invalid', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T08:30:00.000Z' }) // 8:30AM
			const date = DateTime.fromISO('2018-01-11T08:29:00.000Z', { zone: vm.zone }) // 8:29AM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(vm.earlyLimit.minute)
		})

		it('returns the date minute if same hour and valid', () => {
			vm = vmWithProps({ earlyLimitISO: '2018-01-11T08:30:00.000Z' }) // 8:30AM
			const date = DateTime.fromISO('2018-01-11T08:31:00.000Z', { zone: vm.zone }) // 8:31AM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(date.minute)
		})

		it('returns the late limit minute if same hour and invalid', () => {
			vm = vmWithProps({ lateLimitISO: '2018-01-11T20:30:00.000Z' }) // 8:30PM
			const date = DateTime.fromISO('2018-01-11T20:31:00.000Z', { zone: vm.zone }) // 8:31PM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(vm.lateLimit.minute)
		})

		it('returns the date minute if same hour and valid', () => {
			vm = vmWithProps({ lateLimitISO: '2018-01-11T20:30:00.000Z' }) // 8:30PM
			const date = DateTime.fromISO('2018-01-11T20:29:00.000Z', { zone: vm.zone }) // 8:31PM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(date.minute)
		})

		it('returns the date minute if not same hour as early or late limit', () => {
			vm = vmWithProps({
				earlyLimitISO: '2018-01-11T09:00:00.000Z',
				lateLimitISO: '2018-01-11T18:00:00.000Z'
			}) // 9AM to 6PM
			const date = DateTime.fromISO('2018-01-11T13:00:00.000Z', { zone: vm.zone }) // 1PM
			const minute = vm.findAvailableMinute(date)

			expect(minute).toEqual(date.minute)
		})

		it('returns false if no possible minute for early limit')
		it('returns false if no possible minute for late limit')
	})

	/* Helper functions */

	function vmWithProps(propsData) {
		return new Constructor({ propsData: propsData }).$mount()
	}
})
