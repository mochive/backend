import Module from '@library/module';
import getTestsController from './getTests.controller';
import { SchemaType } from '@library/constant';
import testSchema from '@schemas/test';
import getTestController from './getTest.controller';
import testRankcutsModule from './testRankcuts/testRankcuts.module';
import pageSchema from '@schemas/page';

export default new Module([{
	method: 'GET',
	path: '',
	handlers: [getTestsController],
	schema: {
		query: {
			type: SchemaType['OBJECT'],
			properties: Object.assign({
				query: {
					type: SchemaType['STRING'],
					minimum: 1,
					maximum: 128,
					isOptional: true
				},
				months: {
					type: SchemaType['STRING'],
					pattern: /^(([34679]|10|11),)*([34679]|10|11)$/,
					isOptional: true
				},
				grades: {
					type: SchemaType['STRING'],
					pattern: /^([1-3],)*[1-3]$/,
					isOptional: true
				},
				subjects: {
					type: SchemaType['STRING'],
					pattern: /^([1-8],)*[1-8]$/,
					isOptional: true
				},
				startAt: {
					type: SchemaType['STRING'],
					pattern: /^([1-9][0-9]{3},)*[1-9][0-9]{3}$/,
					isOptional: true
				},
				endAt: {
					type: SchemaType['STRING'],
					pattern: /^([1-9][0-9]{3},)*[1-9][0-9]{3}$/,
					isOptional: true
				}
			} as const, pageSchema)
		}
	}
}, {
	method: 'GET',
	path: ':testId',
	handlers: [getTestController],
	schema: {
		parameter: {
			type: SchemaType['OBJECT'],
			properties: {
				testId: testSchema['id']
			}
		}
	}
}], 'tests', [testRankcutsModule]);