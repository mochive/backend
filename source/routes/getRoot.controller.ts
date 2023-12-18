import { Request, Response } from '@library/type';

export default function (request: Request, response: Response): void {
	response.send({
		message: 'You have done great, you are doing great, and you will do great'
	});

	return;
}