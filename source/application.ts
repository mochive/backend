import '@library/environment';
import Module from '@library/module';
import Server from '@library/server';
import rootModule from './routes/root.module';

const server: Server = new Server({
	isProxied: true
});

rootModule.register(server);

server['logger'].info('Routes:\n' + Module.getRouteTree(server));

server.listen(Number(process['env']['PORT']))
.then(function (): void {
	server['logger'].info('http://127.0.0.1:' + process['env']['PORT']);

	return;
})
.catch(server['logger'].fatal);