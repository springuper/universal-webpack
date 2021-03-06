import chai from 'chai'
chai.should()

import { find_style_loaders, is_style_loader, parse_loader, stringify_loader, normalize_loaders } from '../source/loaders'

describe(`webpack loader utilities`, function()
{
	it(`should find style loaders`, function()
	{
		const configuration =
		{
			module:
			{
				loaders:
				[{
					loader: 'babel-loader',
					query: { a: 'b', c: 'd' }
				},
				{
					loader: 'not-a-style-loader!not-a-style-loader-too'
				},
				{
					loader: 'whatever-loader?argument=true!style-loader?parameter=false!css-loader'
				},
				{
					loaders:
					[
						'whatever-loader?argument=true',
						'style-loader?parameter=false'
					]
				}]
			}
		}

		find_style_loaders(configuration).should.deep.equal
		([
			{
				loaders:
				[
					'whatever-loader?argument=true',
					'style-loader?parameter=false',
					'css-loader'
				]
			},
			{
				loaders:
				[
					'whatever-loader?argument=true',
					'style-loader?parameter=false'
				]
			}
		])
	})

	it(`should detect style loader`, function()
	{
		is_style_loader('style-loader').should.equal(true)
		is_style_loader('style-loader?query=true&gay=porn').should.equal(true)
		is_style_loader('style').should.equal(true)
		is_style_loader('style?query=true').should.equal(true)

		is_style_loader('style_loader').should.equal(false)
	})

	it(`should parse loaders`, function()
	{
		parse_loader('style-loader?query=true&gay=porn').should.deep.equal
		({
			name: 'style-loader',
			query:
			{
				query: 'true',
				gay: 'porn'
			}
		})
	})

	it(`should stringify loaders`, function()
	{
		stringify_loader
		({
			name: 'style-loader',
			query:
			{
				query: 'true',
				gay: 'porn'
			}
		})
		.should.equal('style-loader?query=true&gay=porn')
	})

	it(`should normalize loaders`, function()
	{
		let loader =
		{
			loader: 'style-loader',
			query:
			{
				query: 'true',
				gay: 'porn'
			}
		}

		let execute = () => normalize_loaders(loader)
		execute.should.throw(`Unable to normalize a module loader with a "query" object`)

		loader =
		{
			query:
			{
				query: 'true',
				gay: 'porn'
			}
		}

		execute = () => normalize_loaders(loader)
		execute.should.throw(`Neither "loaders" not "loader" are present inside a module loader`)

		loader =
		{
			loader: 'style-loader?query=true&gay=porn!css-loader?a=b'
		}

		normalize_loaders(loader)

		loader.should.deep.equal({ loaders: ['style-loader?query=true&gay=porn', 'css-loader?a=b'] })
	})
})