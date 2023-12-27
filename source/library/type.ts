import { IncomingMessage, ServerResponse } from 'http';
import Server from '@library/server';
import { SchemaType } from '@library/constant';
import { ColumnType } from 'kysely';

type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type NumberSchema = {
	type: SchemaType.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	isOptional?: undefined;
} | {
	type: SchemaType.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	default?: number;
	isOptional: true;
} | {
	type: SchemaType.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	isOptional?: undefined;
} | {
	type: SchemaType.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	default?: number;
	isOptional: true;
};

export type StringSchema = {
	type: SchemaType.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SchemaType.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	default?: string;
	isOptional: true;
} | {
	type: SchemaType.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SchemaType.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
} | {
	type: SchemaType.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SchemaType.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
}

export type BooleanSchema = {
	type: SchemaType.BOOLEAN;
	isOptional?: undefined;
} | {
	type: SchemaType.BOOLEAN;
	default?: boolean;
	isOptional: true;
};

export type NullSchema = {
	type: SchemaType.NULL;
	isOptional?: undefined;
} | {
	type: SchemaType.NULL;
	default?: null;
	isOptional: true;
};

export type ObjectSchema = {
	type: SchemaType.OBJECT;
	properties: Record<string, Schema>;
	allowAdditionalProperties?: true;
	isOptional?: undefined;
} | {
	type: SchemaType.OBJECT;
	properties: Record<string, Schema>;
	isOptional: true;
	default?: {};
	allowAdditionalProperties?: true;
};

export type ArraySchema = {
	type: SchemaType.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SchemaType.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional: true;
	default?: {}[];
};

export type NotSchema = {
	type: SchemaType.NOT;
	isOptional?: true;
	schema: Schema;
};

export type AndSchema = {
	type: SchemaType.AND;
	isOptional?: true;
	schemas: Schema[];
};

export type OrSchema = {
	type: SchemaType.OR;
	isOptional?: true;
	schemas: Schema[];
};

export type Schema = NumberSchema | StringSchema | BooleanSchema | NullSchema | ObjectSchema | ArraySchema | AndSchema | OrSchema | NotSchema;

export type GenericKey = 'parameter' | 'query' | 'header' | 'body';

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Handler = (request: Request<any>, response: Response) => Promise<unknown> | unknown;

export interface Request<Generic extends Partial<Record<GenericKey, unknown>> = Partial<Record<GenericKey, unknown>>> extends Required<Omit<IncomingMessage, 'statusCode' | 'statusMessage'>> {
	startTime: number;
	ip: string;
	server: Server;
	parameter: Generic['parameter'];
	query: Generic['query'];
	header: Generic['header'];
	body: Generic['body'];
}

export interface Response extends ServerResponse {
	request: Request;
	server: Server;
	setStatus(code: number): void;
	send(data?: unknown): void;
	redirect(url: string, code?: number): void;
}

export interface Route {
	handlers: Handler[];
	schema?: Partial<Record<GenericKey, Schema>>;
}

export interface Database {
	test: {
		id: Generated<number>;
		month: 3 | 4 | 6 | 7 | 9 | 10 | 11;
		grade: 1 | 2 | 3;
		subject: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Backward compatibility for EBSi
		name: string;
		question: string;
		answer: string | null;
		commentary: string;
		taken_at: Date;
	};
	test_listening: {
		id: Generated<number>;
		test_id: number;
		audio: string;
		script: string | null;
	};
	test_rankcut: {
		id: Generated<number>;
		test_id: number;
		grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
		original_score: number;
		standard_score: number;
		percentile: number;
	};
}

export interface Test {
	id: number;
	month: 3 | 4 | 6 | 7 | 9 | 10 | 11;
	grade: 1 | 2 | 3;
	subject: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	name: string;
	question: string;
	answer: string | null;
	commentary: string;
	takenAt: Date;
}

export interface TestListening {
	id: number;
	testId: number;
	audio: string;
	script: string | null;
}

export interface TestRankcut {
	id: number;
	testId: number;
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	originalScore: number;
	standardScore: number;
	percentile: number;
}

export interface PageQuery {
	'page[size]': number;
	'page[index]': number;
	'page[order]': 'desc' | 'asc';
}