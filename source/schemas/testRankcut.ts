import { SchemaType } from '@library/constant';
import { TestRankcut, Schema } from '@library/type';
import commonSchema from '@schemas/common';
import testSchema from '@schemas/test';

export default {
	id: commonSchema['positiveInteger'],
	testId: testSchema['id'],
	grade: {
		type: SchemaType['NUMBER'],
		minimum: 1,
		maximum: 9
	},
	// What about exploration section and history?? IDK
	originalScore: commonSchema['percentile'],
	standardScore: {
		type: SchemaType['NUMBER'],
		minimum: 0,
		maximum: 200
	},
	percentile: commonSchema['percentile']
} satisfies Record<keyof TestRankcut, Schema>;