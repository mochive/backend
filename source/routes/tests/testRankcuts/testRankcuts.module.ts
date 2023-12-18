import Module from '@library/module';
import getTestRankcutsController from './getTestRankcuts.controller';
import { SchemaType } from '@library/constant';
import testRankcutSchema from '@schemas/testRankcut';

export default new Module([{
	method: 'GET',
	path: '',
	handlers: [getTestRankcutsController],
	schema: {
		parameter: {
			type: SchemaType['OBJECT'],
			properties: {
				testId: testRankcutSchema['testId']
			}
		}
	}
}], ':testId/rankcuts');