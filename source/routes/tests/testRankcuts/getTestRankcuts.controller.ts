import { kysely } from '@library/database';
import { NotFound } from '@library/error';
import { Database, Test, TestRankcut, Request, Response } from '@library/type';
import { Transaction } from 'kysely';

export default function (request: Request<{
	parameter: {
		testId: Test['id'];
	}
}>, response: Response): Promise<void> {
	return kysely.transaction()
	.execute(function (transaction: Transaction<Database>): Promise<void> {
		return transaction.selectFrom('test')
		.select('id')
		.where('id', '=', request['parameter']['testId'])
		.executeTakeFirst()
		.then(function (test?: Pick<Test, 'id'>): Promise<Pick<TestRankcut, 'id' | 'grade' | 'originalScore' | 'standardScore' | 'percentile'>[]> {
			if(typeof(test) !== 'undefined') {
				return transaction.selectFrom('test_rankcut')
				.select(['id', 'grade', 'original_score as originalScore', 'standard_score as standardScore', 'percentile'])
				.where('test_id', '=', request['parameter']['testId'])
				.orderBy('grade asc')
				.execute();
			} else {
				throw new NotFound('Parameter[\'testId\'] must be valid');
			}
		})
		.then(response.send.bind(response));
	});
}