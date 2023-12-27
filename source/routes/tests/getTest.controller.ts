import { kysely } from '@library/database';
import { NotFound } from '@library/error';
import { Database, Test, TestListening, TestRankcut, Request, Response } from '@library/type';
import { getFullDate } from '@library/utility';
import { Transaction } from 'kysely';

export default function (request: Request<{
	parameter: {
		testId: Test['id'];
	};
}>, response: Response): Promise<void> {
	return kysely.transaction()
	.execute(function (transaction: Transaction<Database>): Promise<void> {
		let test: Omit<Test, 'answer'> & {
			answer?: NoneNullable<Test['answer']>;
			listening?: Pick<TestListening, 'id' | 'audio' | 'script'>;
		};

		return transaction.selectFrom('test')
		.select(['test.id', 'test.month', 'test.grade', 'test.subject', 'test.name', 'test.question', 'test.answer', 'test.commentary', 'test.taken_at as takenAt'])
		.where('test.id', '=', request['parameter']['testId'])
		.leftJoin('test_listening as listening', 'test.id', 'listening.test_id')
		.select(['listening.id as listening_id', 'listening.audio as listening_audio', 'listening.script as listening_script'])
		.executeTakeFirst()
		.then(function (rawTest?: Test & Nullable<PrefixPick<TestListening, 'listening_', 'id' | 'audio' | 'script'>>): Promise<Pick<TestRankcut, 'id' | 'grade' | 'originalScore' | 'standardScore' | 'percentile'>[]> {
			if(typeof(rawTest) !== 'undefined') {
				test = {
					id: rawTest['id'],
					month: rawTest['month'],
					grade: rawTest['grade'],
					subject: rawTest['subject'],
					name: rawTest['name'],
					question: rawTest['question'],
					answer: rawTest['answer'] !== null ? rawTest['answer'] : undefined,
					commentary: rawTest['commentary'],
					takenAt: rawTest['takenAt'],
					listening: typeof(rawTest['listening_id']) === 'number' ? {
						id: rawTest['listening_id'],
						audio: rawTest['listening_audio'] as string,
						script: rawTest['listening_script']
					} : undefined
				};
	
				return transaction.selectFrom('test_rankcut')
				.select(['id', 'grade', 'original_score as originalScore', 'standard_score as standardScore', 'percentile'])
				.where('test_id', '=', request['parameter']['testId'])
				.orderBy('grade asc')
				.execute();
			} else {
				throw new NotFound('Parameter[\'testId\'] must be valid');
			}
		})
		.then(function (rankcuts: Pick<TestRankcut, 'id' | 'grade' | 'originalScore' | 'standardScore' | 'percentile'>[]): void {
			response.send(Object.assign(test, {
				takenAt: getFullDate(test['takenAt']),
				rankcuts: rankcuts
			}) satisfies Omit<Test, 'answer' | 'takenAt'> & {
				answer?: NoneNullable<Test['answer']>;
				takenAt: string;
				listening?: Pick<TestListening, 'id' | 'audio' | 'script'>;
				rankcuts?: Pick<TestRankcut, 'id' | 'grade' | 'originalScore' | 'standardScore' | 'percentile'>[];
			});
			
			return;
		});
	});
}