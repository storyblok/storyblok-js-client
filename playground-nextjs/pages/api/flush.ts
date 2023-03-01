// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { flush } from '@/lib/redis'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  flush().then(() => res.status(200)).catch(() => res.status(500))
}
