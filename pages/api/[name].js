import clientPromise from "../../lib/mongo";


export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(); // uses the default DB from your Mongo URI
        const name = req.url.split("api/")[1].replaceAll("-", " ").replaceAll("%20", " ");
        const collection = await db.collection(name);

        const documents = await collection
            .find({})
            .skip(Number(0))
            .limit(Number(10))
            .toArray();

        return res.status(200).json({ data: documents });
    } catch (error) {
        console.error('Error in /api/collections:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}