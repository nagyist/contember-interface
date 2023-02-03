import { BaseController } from './BaseController'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { TenantClient } from '../services/TenantClient'
import type { S3Manager } from '../services/S3Manager'
import { readAuthCookie } from '../utils/cookies'
import { ConfigResolver } from '../services/ConfigResolver'

interface MeResponsePayload {
	email: string
	personId: string

	projects: Array<{
		name: string
		slug: string
		roles: string[]
	}>
}

interface MeParams {
	projectGroup: string | undefined
}

export class MeController extends BaseController<MeParams> {
	constructor(
		private tenant: TenantClient,
		private s3: S3Manager,
		private configResolver: ConfigResolver,
	) {
		super()
	}

	async handle(req: IncomingMessage, res: ServerResponse, { projectGroup }: MeParams): Promise<void> {
		const token = readAuthCookie(req)
		if (token === null) {
			res.writeHead(403)
			res.end('missing auth cookie')
			return
		}

		const me = await this.tenant.getMe(token, projectGroup)
		if (me === null) {
			res.writeHead(403)
			res.end('cookie contains invalid token')
			return
		}

		const config = await this.configResolver.getConfig(projectGroup)
		const projectsWithAdmin = await this.s3.listProjectSlugs({ projectGroup })
		const projects = me.projects
			.filter(it => projectsWithAdmin.includes(it.project.slug))
			.map(it => ({ name: it.project.name, slug: it.project.slug, roles: it.memberships.map(it => it.role) }))
			.filter(it => {
				const allowedRoles = config?.projects?.[it.slug]?.allowedRoles
				return allowedRoles === undefined || it.roles.some(role => allowedRoles.includes(role))
			})

		const payload: MeResponsePayload = { email: me.person.email, personId: me.person.id, projects	}
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(payload))
	}
}
