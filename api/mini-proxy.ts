import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios';

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (req.body && req.body.url) {
    const response: any = await axios
      .get(req.body.url)
      .then(({ data }) => {
        return data
      })

    // res.json({...response})
    res.send(response)
    return;
  }

  res.json({ error: true })
  
}