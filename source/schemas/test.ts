import { Test, Schema } from '@library/type';
import { SchemaType } from '@library/constant';
import commonSchema from '@schemas/common';

export default {
	id: commonSchema['positiveInteger'],
	month: {
		type: SchemaType['NUMBER'],
		enum: [3, 4, 6, 7, 9, 10, 11]
	},
	grade: {
		type: SchemaType['NUMBER'],
		minimum: 1,
		maximum: 3
	},
	subject: {
		type: SchemaType['NUMBER'],
		minimum: 1,
		maximum: 8
	},
	name: {
		type: SchemaType['STRING'],
		maximum: 48
	},
	question: commonSchema['path'],
	commentary: commonSchema['path'],
	takenAt: {
		type: SchemaType['STRING'],
		pattern: /^[1-9][0-9]{3}-(0[1-9]|1[0-2])$/
	}
} satisfies Record<keyof Test, Schema>;