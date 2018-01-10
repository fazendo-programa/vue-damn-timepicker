import Vue from 'vue'
import App from '@/App'

describe('DamnTimepicker.vue', () => {
	let Constructor
	let vm

	beforeEach(() => {
		Constructor = Vue.extend(App)
		vm = new Constructor().$mount()
	})

	it('mounts with DamnTimepicker', () => {
		expect(vm).toBeDefined()
	})
})