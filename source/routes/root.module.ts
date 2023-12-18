import Module from '@library/module';
import getRootController from './getRoot.controller';
import getFaviconIcoController from './getFaviconIco.controller';
import getRobotsTxtController from './getRobotsTxt.controller';
import postAndGetCoffeeController from './postAndGetCoffee.controller';
import wellKnownModule from './.well-known/wellKnown.module';
import testsModule from './tests/tests.module';

export default new Module([{
	method: 'GET',
	path: '',
	handlers: [getRootController]
}, {
	method: 'GET',
	path: 'favicon.ico',
	handlers: [getFaviconIcoController]
}, {
	method: 'GET',
	path: 'robots.txt',
	handlers: [getRobotsTxtController]
}, {
	method: 'POST',
	path: 'coffee',
	handlers: [postAndGetCoffeeController]
}, {
	method: 'GET',
	path: 'coffee',
	handlers: [postAndGetCoffeeController]
}], '/', [wellKnownModule, testsModule]);