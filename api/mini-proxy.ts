import { NowRequest, NowResponse } from '@now/node'

module.exports = (req: NowRequest, res: NowResponse) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies
  })
}