export interface ISbContentMAPIReleases {
	id: number
	name: string
	release_at: string
	branches_to_deploy: number[]
	do_release?: boolean
}
