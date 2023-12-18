import { Schema } from '@library/type';
import { SchemaType } from '@library/constant';

export default {
	positiveInteger: {
		type: SchemaType['NUMBER'],
		isInteger: true,
		minimum: 1,
		maximum: Number['MAX_VALUE']
	},
	index: {
		type: SchemaType['NUMBER'],
		isInteger: true,
		minimum: 0,
		maximum: Number['MAX_VALUE']
	},
	path: {
		type: SchemaType['STRING'],
		maximum: 64
	},
	percentile: {
		type: SchemaType['NUMBER'],
		minimum: 0,
		maximum: 100
	}
} satisfies Record<'positiveInteger' | 'index' | 'path' | 'percentile', Schema>;