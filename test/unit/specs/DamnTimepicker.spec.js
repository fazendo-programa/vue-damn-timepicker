import Vue from 'vue'
import DamnTimepicker from '@/components/DamnTimepicker'

describe('DamnTimepicker.vue', () => {
	let Constructor
	let vm

	beforeEach(() => {
		Constructor = Vue.extend(DamnTimepicker)
		vm = new Constructor().$mount()
	})

	describe('#upperLimit', () => {
		it('parses a valid ISO string', () => {
			const ISOString = '2018-01-09T09:00:00.000Z'
			vm = vmWithProps({ upperLimitISO: ISOString })

			expect(vm.upperLimit.isValid).toEqual(true)
			expect(vm.upperLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			vm = vmWithProps({ upperLimitISO: undefined })
			expect(vm.upperLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			vm = vmWithProps({ upperLimitISO: 'abc' })
			expect(vm.upperLimit.isValid).toEqual(false)
		})
	})

	describe('#lowerLimit', () => {
		it('parses a valid ISO string', () => {
			const ISOString = '2018-01-09T09:00:00.000Z'
			vm = vmWithProps({ lowerLimitISO: ISOString })

			expect(vm.lowerLimit.isValid).toEqual(true)
			expect(vm.lowerLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			vm = vmWithProps({ lowerLimitISO: undefined })
			expect(vm.lowerLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			vm = vmWithProps({ lowerLimitISO: 'abc' })
			expect(vm.lowerLimit.isValid).toEqual(false)
		})
	})

	describe('#hoursInDay', () => {
		it('has a list of all hours in day', () => {
			const hours = vm.hoursInDay
			expect(hours.length).toEqual(24)
		})

		it('filters by upperLimit', () => {
			vm = vmWithProps({ upperLimitISO: '2018-01-11T06:00:00.000Z' })

			expect(vm.hoursInDay.length).toEqual(7)
			expect(vm.hoursInDay).toEqual([0,1,2,3,4,5,6])
		})

		it('filters by lowerLimit', () => {
			vm = vmWithProps({ lowerLimitISO: '2018-01-11T17:00:00.000Z' })

			expect(vm.hoursInDay.length).toEqual(7)
			expect(vm.hoursInDay).toEqual([17,18,19,20,21,22,23])
		})

		it('does not break for invalid upperLimitISO', () => {
			vm = vmWithProps({ upperLimitISO: '2018-01-11T7:00:00.000Z' })
			expect(vm.hoursInDay.length).toEqual(24)
		})

		it('does not break for invalid lowerLimitISO', () => {
			vm = vmWithProps({ lowerLimitISO: '2018-01-11T7:00:00.000Z' })
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

	/* Helper functions */

	function vmWithProps(propsData) {
		return new Constructor({ propsData: propsData }).$mount()
	}
})
