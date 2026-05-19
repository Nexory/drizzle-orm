import type { TypeOf } from 'zod';
import { boolean, coerce, object, string, union } from 'zod';
import { ConfigConnectionCliError } from '../errors';
import { error } from '../views';
import { wrapParam } from './common';

export const mssqlCredentials = union([
	object({
		port: coerce.number().min(1).optional(),
		user: string().min(1),
		password: string().min(1),
		database: string().min(1).optional(),
		server: string().min(1),
		options: object({
			encrypt: boolean().optional(),
			trustServerCertificate: boolean().optional(),
		}).optional(),
	}),
	object({
		url: string().min(1),
	}),
]);

export type MssqlCredentials = TypeOf<typeof mssqlCredentials>;

export const printConfigConnectionIssues = (
	options: Record<string, unknown>,
	_command?: 'generate' | 'migrate' | 'push' | 'pull' | 'studio',
): never => {
	if (
		'port' in options || 'user' in options || 'password' in options || 'database' in options || 'server' in options
		|| 'options' in options
	) {
		let text = `Please provide required params for MsSQL driver:\n`;
		throw new ConfigConnectionCliError(
			'mssql',
			['server', 'port', 'user', 'password', 'database'],
			[
				error(text),
				wrapParam('server', options.server),
				wrapParam('port', options.port, true),
				wrapParam('user', options.user),
				wrapParam('password', options.password, false, 'secret'),
				wrapParam('database', options.database, true),
				wrapParam('options', options.options, true),
			].join('\n'),
			_command,
		);
	}

	let text = `Please provide required params for MsSQL driver:\n`;
	throw new ConfigConnectionCliError(
		'mssql',
		['url'],
		[
			error(text),
			wrapParam('url', options.url, false, 'url'),
		].join('\n'),
		_command,
	);
};
