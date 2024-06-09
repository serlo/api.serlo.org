import { createWriteStream, WriteStream } from 'fs'
import { createGzip, Gzip } from 'zlib'
import { tmpdir } from 'os'
import path from 'path'
import { WebClient } from '@slack/web-api'
import { once } from 'events'

export class SlackLogger {
  private logFileName: string
  private logFilePath: string
  private gz: Gzip
  private writeStream: WriteStream

  constructor(private name: string) {
    const currentDate = new Date().toISOString().slice(0, 10)

    this.logFileName = `${currentDate}-${this.name}.log.jsonl.gz`
    this.logFilePath = path.join(tmpdir(), this.logFileName)

    this.gz = createGzip()
    this.writeStream = createWriteStream(this.logFilePath)

    this.gz.pipe(this.writeStream)

    this.logEvent('logStarted', { name: this.name })
  }

  logEvent(eventType: string, data: unknown) {
    const event = { eventType, data, time: new Date().toISOString() }

    this.write(JSON.stringify(event))
    this.write('\n')
  }

  async closeAndSend() {
    await this.close()
    await this.send()
  }

  protected async close() {
    this.logEvent('logEnded', { name: this.name })

    this.gz.end()
    await once(this.gz, 'finish')
    await once(this.writeStream, 'finish')
  }

  protected async send() {
    const environment = process.env.ENVIRONMENT
    const token = process.env.SLACK_TOKEN
    const channel = process.env.SLACK_CHANNEL

    if (token == null) return

    const slack = new WebClient(token)

    await slack.files.uploadV2({
      file: this.logFilePath,
      filename: this.logFileName,
      channel_id: channel,
      initial_comment: `*${environment}:* Migration "${this.name}" finished.`,
    })
  }

  private async write(data: string) {
    if (!this.gz.write(data)) {
      await once(this.gz, 'drain')
    }
  }
}
