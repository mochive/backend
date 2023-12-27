import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { elasticsearch, kysely } from '@library/database';
import { BadRequest } from '@library/error';
import { Database, Test, TestListening, PageQuery, Request, Response } from '@library/type';
import { getFullDate, getQueryArray } from '@library/utility';
import { SelectQueryBuilder, sql } from 'kysely';

export default function (request: Request<{
	query: PageQuery & {
		months?: string;
		grades?: string;
		subjects?: string;
		startAt?: string;
		endAt?: string;
		term?: string;
	};
}>, response: Response): Promise<void> {
	let startAt: number;

	return (typeof(request['query']['term']) === 'string' ? elasticsearch.search({
		index: 'test',
		size: request['query']['page[size]'],
		from: request['query']['page[size]'] * request['query']['page[index]'],
		_source: false,
		min_score: 1,
		query: {
			multi_match: {
				query: request['query']['term'],
				fields: ['title', 'title.nori^0.9', 'title.ngram^0.7', 'content^0.5', 'content.nori^0.45']
			}
		}
	})
	.then(function (result: SearchResponse): string | undefined {
		let condition: string | undefined;
		
		if(result['hits']['hits']['length'] !== 0) {
			condition = result['hits']['hits'][0]['_id'];

			for(let i: number = 1; i < result['hits']['hits']['length']; i++) {
				condition += ',' + result['hits']['hits'][i]['_id'];
			}
		}

		return condition;
	}) : Promise.resolve() as Promise<string | undefined>)
	.then(function (condition: string | undefined): Promise<(Test & Nullable<PrefixPick<TestListening, 'listening_', 'id' | 'audio' | 'script'>>)[]> {
		return kysely.selectFrom('test')
		.select(['test.id', 'test.month', 'test.grade', 'test.subject', 'test.name', 'test.question', 'test.commentary', 'test.taken_at as takenAt'])
		// I'm too lazy
		.$if(true, function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			if(typeof(condition) === 'string') {
				return queryBuilder.where('test.id', 'in', sql.raw(condition))
				.orderBy(sql.raw('FIELD(test.id,' + condition + ')'))
				.orderBy('test.grade', 'asc')
				.orderBy('test.subject', 'asc');
			} else {
				return queryBuilder.orderBy('test.taken_at', request['query']['page[order]'] === 'asc' ? 'asc' : 'desc')
				.orderBy('test.grade', 'asc')
				.orderBy('test.subject', 'asc')
				.limit(request['query']['page[size]'])
				.offset(request['query']['page[size]'] * request['query']['page[index]']);
			}
		})
		.$if(typeof(request['query']['startAt']) === 'string', function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			startAt = Number(request['query']['startAt']);
			
			if(startAt >= 2006) {
				return queryBuilder.where(sql.raw('YEAR(taken_at)'), '>=', request['query']['startAt']);
			} else {
				throw new BadRequest('Query[\'startAt\'] must be valid');
			}
		})
		.$if(typeof(request['query']['endAt']) === 'string', function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			const endAt: number = Number(request['query']['endAt']);
			
			if(endAt <= (new Date()).getFullYear()) {
				if(typeof(startAt) !== 'number' || endAt >= startAt) {
					return queryBuilder.where(sql.raw('YEAR(taken_at)'), '<=', request['query']['endAt']);
				} else {
					throw new BadRequest('Query[\'startAt\'] must be valid');
				}
			} else {
				throw new BadRequest('Query[\'endAt\'] must be valid');
			}
		})
		.$if(typeof(request['query']['months']) === 'string', function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			return queryBuilder.where('test.month', 'in', getQueryArray(request['query']['months'] as string) as Test['month'][]);
		})
		.$if(typeof(request['query']['grades']) === 'string', function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			return queryBuilder.where('test.grade', 'in', getQueryArray(request['query']['grades'] as string) as Test['grade'][]);
		})
		.$if(typeof(request['query']['subjects']) === 'string', function (queryBuilder: SelectQueryBuilder<Database, 'test', Test>): SelectQueryBuilder<Database, 'test', Test> {
			return queryBuilder.where('test.subject', 'in', getQueryArray(request['query']['subjects'] as string) as Test['subject'][]);
		})
		.leftJoin('test_listening as listening', 'test.id', 'listening.test_id')
		.select(['listening.id as listening_id', 'listening.audio as listening_audio', 'listening.script as listening_script'])
		.execute();
	})
	.then(function (rawTests: (Test & Nullable<PrefixPick<TestListening, 'listening_', 'id' | 'audio' | 'script'>>)[]): void {
		const tests: (Omit<Test, 'takenAt'> & {
			takenAt: string;
			listening?: Pick<TestListening, 'id' | 'audio' | 'script'>;
		})[] = [];

		for(let i: number = 0; i < rawTests['length']; i++) {
			tests.push(Object.assign({
				id: rawTests[i]['id'],
				month: rawTests[i]['month'],
				grade: rawTests[i]['grade'],
				subject: rawTests[i]['subject'],
				name: rawTests[i]['name'],
				question: rawTests[i]['question'],
				commentary: rawTests[i]['commentary'],
				takenAt: getFullDate(rawTests[i]['takenAt'])
			} as const, typeof(rawTests[i]['listening_id']) === 'number' ? {
				listening: {
					id: rawTests[i]['listening_id'] as number,
					audio: rawTests[i]['listening_audio'] as string,
					script: rawTests[i]['listening_script']
				}
			} as const : undefined));
		}

		response.send(tests);

		return;
	})

}