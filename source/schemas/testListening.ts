import { TestListening, Schema } from '@library/type';
import commonSchema from '@schemas/common';
import testSchema from '@schemas/test';

export default {
	id: commonSchema['positiveInteger'],
	testId: testSchema['id'],
	audio: commonSchema['path'],
	script: commonSchema['path']
} satisfies Record<keyof TestListening, Schema>;