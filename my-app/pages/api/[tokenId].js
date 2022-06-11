export default function handler(req, res) {
    const tokenId = req.query.tokenId
    const name = `Web3Devs #${tokenId}`
    const description = 'Web3Devs is an NFT Collection for Web3 Developers!'
    const image = `https://raw.githubusercontent.com/sharathguvvala/NFT-Collection/main/my-app/public/Web3Devs/${tokenId}.svg`
    res.status(200).json({ 
        name: name,
        description: description,
        image: image 
    })
}