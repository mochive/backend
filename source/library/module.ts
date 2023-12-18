import { join } from 'path/posix';
import { Handler, Method, Request, Response, Route } from '@library/type';
import Server from '@library/server';
import { redis } from './database';
import { TooManyRequests } from './error';

export default class Module {
	public static paths: Set<string> = new Set<string>();
	private routes: (Route & {
		method: Method;
		path: string;
	})[];
	private prefix: string;
	private modules: Module[];
	private static readonly methods: Method[] = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];
	private static readonly rateLimit: number = Number(process['env']['RATE_LIMIT']);

	constructor(routes: Module['routes'], prefix: Module['prefix'] = '/', modules: Module['modules'] = []) {
		this['routes'] = routes;
		this['prefix'] = prefix;
		this['modules'] = modules;
	}

	public static getRouteTree(server: Server): string {
		let routeTree: string = '';

		for(const path of Module['paths']) {
			routeTree += '\n' + path;

			const methods: Method[] = [];

			for(let i: number = 0; i < Module['methods']['length']; i++) {
				if(server['router'].find(Module['methods'][i], path) !== null) {
					methods.push(Module['methods'][i]);
				}
			}

			routeTree += ' (' + methods.join(', ') + ')';
		}

		return routeTree.slice(1);
	}

	private static rateLimitHandler(request: Request): Promise<void> {
		const key: string = 'rateLimit:' + request['ip'];

		return redis.incr(key)
		.then(function (requestCount: number): void {
			if(requestCount === 1) {
				redis.expire(key, 60)
				.catch(request['server']['logger'].error);
			} else if(requestCount > Module['rateLimit']) {
				throw new TooManyRequests('Request per minute must be fewer');
			}

			return;
		});
	}

	public appendPrefix(prefix: string): void {
		this['prefix'] = join(prefix, this['prefix']);

		return;
	}

	public register(server: Server): void {
		for(let i: number = 0; i < this['routes']['length']; i++) {
			const path: string = join(this['prefix'], this['routes'][i]['path']);
			
			if(!Module['paths'].has(path)) {
				Module['paths'].add(path);

				server.register('OPTIONS', path, {
					handlers: [function (request: Request, response: Response): void {
						response.send(null);

						return;
					}]
				});
			}

			server.register(this['routes'][i]['method'], path, {
				handlers: ([Module.rateLimitHandler] as Handler[]).concat(this['routes'][i]['handlers']),
				schema: this['routes'][i]['schema']
			});
		}

		for(let i: number = 0; i < this['modules']['length']; i++) {
			this['modules'][i].appendPrefix(this['prefix']);
			this['modules'][i].register(server);
		}

		return;
	}
}