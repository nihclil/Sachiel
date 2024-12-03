import { Logging } from '@google-cloud/logging'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { GCP_LOG_NAME, GCP_PROJECT_ID } from '@/constants/config'
import { logServerSideError } from '@/utils/log'

const loggingClient = new Logging({
  projectId: GCP_PROJECT_ID,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const log = loggingClient.log(GCP_LOG_NAME)
    const metadata = {
      resource: { type: 'global' },
      severity: 'INFO',
    }
    const clientIp = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(
      ','
    )[0]

    body.clientInfo.ip = clientIp

    const entry = log.entry(metadata, body)
    log.write(entry)
    return NextResponse.json({ message: 'Log recorded successfully' })
  } catch (error) {
    logServerSideError(error, 'Error writing log')
    return NextResponse.json({ message: 'Failed to record log', error })
  }
}
