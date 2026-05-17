import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const BBB_URL    = process.env.BBB_URL    || 'https://test.bigbluebutton.org/bigbluebutton/api'
const BBB_SECRET = process.env.BBB_SECRET || '8cd8ef52e8e101574e400365b55e11a6'

function checksum(action: string, params: string): string {
  return crypto.createHash('sha256').update(action + params + BBB_SECRET).digest('hex')
}

function bbbUrl(action: string, params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString()
  const cs = checksum(action, qs)
  return `${BBB_URL}/${action}?${qs}&checksum=${cs}`
}

async function callBBB(action: string, params: Record<string, string>) {
  const url = bbbUrl(action, params)
  const res  = await fetch(url, { cache: 'no-store' })
  const text = await res.text()
  return text
}

function parseXML(xml: string): Record<string, string> {
  const map: Record<string, string> = {}
  const tags = xml.match(/<(\w+)>([^<]*)<\/\1>/g) || []
  for (const tag of tags) {
    const m = tag.match(/<(\w+)>([^<]*)<\/\1>/)
    if (m) map[m[1]] = m[2]
  }
  return map
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...params } = body as { action: string; [k: string]: string }

    if (action === 'createMeeting') {
      const xml  = await callBBB('create', {
        meetingID:        params.meetingID,
        name:             params.name,
        attendeePW:       params.attendeePW || 'ap',
        moderatorPW:      params.moderatorPW || 'mp',
        record:           'true',
        autoStartRecording: 'false',
        welcome:          `Bienvenue dans <b>${params.name}</b> — ETAGIA LMS`,
        maxParticipants:  '100',
        logoutURL:        'https://etagia-lms.vercel.app/live',
      })
      const parsed = parseXML(xml)
      return NextResponse.json({ ok: parsed.returncode === 'SUCCESS', ...parsed })
    }

    if (action === 'joinMeeting') {
      const joinUrl = bbbUrl('join', {
        meetingID:  params.meetingID,
        fullName:   params.fullName || 'Apprenant ETAGIA',
        password:   params.role === 'moderator' ? (params.moderatorPW || 'mp') : (params.attendeePW || 'ap'),
        userID:     params.userID || 'user_' + Date.now(),
        avatarURL:  '',
        redirect:   'true',
      })
      return NextResponse.json({ ok: true, joinUrl })
    }

    if (action === 'getMeetingInfo') {
      const xml    = await callBBB('getMeetingInfo', { meetingID: params.meetingID, password: params.moderatorPW || 'mp' })
      const parsed = parseXML(xml)
      return NextResponse.json({ ok: parsed.returncode === 'SUCCESS', ...parsed, raw: xml })
    }

    if (action === 'isMeetingRunning') {
      const xml    = await callBBB('isMeetingRunning', { meetingID: params.meetingID })
      const parsed = parseXML(xml)
      return NextResponse.json({ ok: true, running: parsed.running === 'true' })
    }

    if (action === 'endMeeting') {
      const xml    = await callBBB('end', { meetingID: params.meetingID, password: params.moderatorPW || 'mp' })
      const parsed = parseXML(xml)
      return NextResponse.json({ ok: parsed.returncode === 'SUCCESS', ...parsed })
    }

    if (action === 'getMeetings') {
      const xml    = await callBBB('getMeetings', {})
      return NextResponse.json({ ok: true, raw: xml })
    }

    return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
