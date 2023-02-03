import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Json, Type } from '../utils/schema'
import { Buffer } from 'node:buffer'

export abstract class BaseController<T = {}> {
	abstract handle(req: IncomingMessage, res: ServerResponse, params: T): Promise<void>

	protected readBearerToken(req: IncomingMessage): string | null {
		if (req.headers.authorization === undefined) {
			return null
		}

		const [type, token] = req.headers.authorization.split(' ', 2)

		if (type !== 'Bearer' || token === undefined) {
			return null
		}

		return token
	}

	protected readRawBody(req: IncomingMessage): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = []

			req.on('data', chunk => chunks.push(chunk))

			req.on('end', () => {
				resolve(Buffer.concat(chunks))
			})

			req.on('error', (error: Error) => {
				reject(error)
			})
		})
	}

	protected async readJsonBody<T extends Json>(req: IncomingMessage, type: Type<T>): Promise<T> {
		const rawBody = await this.readRawBody(req)
		const textBody = rawBody.toString('utf8')
		const jsonBody = JSON.parse(textBody)

		return type(jsonBody)
	}
}
