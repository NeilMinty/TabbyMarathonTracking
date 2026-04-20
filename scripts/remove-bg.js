const sharp = require('sharp')
const path = require('path')

const input = path.join(__dirname, '../public/tabby.jpg')
const output = path.join(__dirname, '../public/tabby.png')

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const buf = Buffer.from(data)

  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i]
    const g = buf[i + 1]
    const b = buf[i + 2]
    if (r > 230 && g > 230 && b > 230) {
      buf[i + 3] = 0
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png()
    .toFile(output)

  console.log(`Saved ${output}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
