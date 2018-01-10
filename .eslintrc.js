// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
	},
	extends: 'standard',
	plugins: [
		'html'
	],
	rules: {
		'generator-star-spacing': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'indent': [1, 'tab'],
		'no-tabs': 0,
		'space-before-function-paren': ['error', 'never']
	}
}
