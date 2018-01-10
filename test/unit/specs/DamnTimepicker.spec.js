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
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ upperLimitISO: ISOString })

			expect(vm.upperLimit.isValid).toEqual(true)
			expect(vm.upperLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ upperLimitISO: undefined })

			expect(vm.upperLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ upperLimitISO: 'abc' })

			expect(vm.upperLimit.isValid).toEqual(false)
		})
	})

	describe('#lowerLimit', () => {
		it('parses a valid ISO string', () => {
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ lowerLimitISO: ISOString })

			expect(vm.lowerLimit.isValid).toEqual(true)
			expect(vm.lowerLimit.toISO()).toEqual(ISOString)
		})

		it('is invalid for empty', () => {
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ lowerLimitISO: undefined })

			expect(vm.lowerLimit.isValid).toEqual(false)
		})

		it('is invalid for a non-ISO date', () => {
			const ISOString = '2018-01-09T09:00:00.000-02:00'
			vm = vmWithProps({ lowerLimitISO: 'abc' })

			expect(vm.lowerLimit.isValid).toEqual(false)
		})
	})

	describe('#hoursInDay', () => {
		it('has a list of all hours in day', () => {
			const hours = vm.hoursInDay
			expect(hours.length).toEqual(24)
		})
	})

	describe('#minutesInDay', () => {
		it('has a list of all minutes in day', () => {
			const minutes = vm.minutesInDay
			expect(minutes.length).toEqual(60)
		})
	})

	/* Helper functions */

	function vmWithProps(propsData) {
		return new Constructor({ propsData: propsData }).$mount()
	}
})
