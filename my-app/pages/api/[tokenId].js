export default function handler(req, res) {
    const tokenId = req.query.tokenId
    const name = `Web3Devs #${tokenId}`
    const description = 'Web3Devs is an NFT Collection for Web3 Developers!'
    const image = ``
    res.status(200).json({ name: 'John Doe' })
}