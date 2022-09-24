const axios = require('axios')
require('dotenv').config()
const fs = require('fs/promises')

const authZendesk = `Basic ${Buffer.from(
  `${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_TOKEN}`
).toString('base64')}`

const zendeskAPI = axios.create({
  baseURL: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`,
  headers: {
    Authorization: authZendesk,
  },
})

const zendeskAPI2 = axios.create({
  baseURL: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`,
  headers: {
    Authorization: authZendesk,
    'Content-Type': 'image/png',
  },
  responseType: 'arraybuffer', // important
})

const getAttachments = async (ticket_id) => {
  let attachments = []
  const response = await zendeskAPI.get(
    `/api/v2/tickets/${ticket_id}/comments?include=users`
  )
  response.data.comments.forEach((element) => {
    if (element.attachments.length)
      attachments = [...attachments, ...element.attachments]
  })
  return attachments
}

const getRequester = async (ticket_id) => {
  const response = await zendeskAPI.get(
    `/api/v2/tickets/${ticket_id}.json?include=users`
  )
  return response.data.users.find(
    (item) => item.id === response.data.ticket.requester_id
  )
}

const getBinaryAttachments = async (attachments) => {
  let content = []
  for (item of attachments) {
    const url = item.content_url.replace(zendeskAPI.baseURL, '')
    const response = await zendeskAPI2.get(url)
    //console.log(response.headers)
    //var data = reponse.data.replace(/^data:image\/\w+;base64,/, "");
    //content.push(Buffer.from(data, 'base64')) //se precisar do arquivo base64
    //console.log(Buffer.from(response.data,'binary'))
    console.log(response.data)
    content.push(Buffer.from(response.data, 'binary'))
  }

  return content
}

const main = async () => {
  const attachments = await getAttachments('2')
  const requester = await getRequester('2')
  const binaryAttachments = await getBinaryAttachments(attachments)
  console.log(attachments)

  await fs
    .writeFile('fileImagem2.txt', binaryAttachments[0])
    .then(console.log)
    .catch(console.log)

  //console.log(base64Attachments[0])
  //console.log(requester)
  //console.log(attachments)
}

main()
