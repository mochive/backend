
import { Database } from '@library/type';
import { createPool } from 'mariadb';
import { Kysely } from 'kysely';
import { MariadbDialect } from '@library/mariadbDialect';
import Logger from './logger';
import { Redis } from 'ioredis';
import { Client } from '@elastic/elasticsearch';

export const kysely: Kysely<Database> = new Kysely<Database>({
	dialect: new MariadbDialect(createPool(process['env']['DATABASE_URL']))
});

export const redis: Redis = new Redis(process['env']['CACHE_DATABASE_URL'])
.on('error', function (error: Error): void {
	switch((error as Error & Record<'code', string>)['code']) {
		case 'ECONNRESET':
		case 'ECONNREFUSED': {
			break;
		}

		default: {
			Logger['logger'].error(error);

			break;
		}
	}

	return;
});

export const elasticsearch: Client = new Client({
	node: process['env']['SEARCH_DATABASE_URL']
});