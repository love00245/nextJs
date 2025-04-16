import clientPromise from "../../lib/mongo";


export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(); // uses the default DB from your Mongo URI
        const { limit = 10, offset = 0 } = req.query;
        const collections = await db.listCollections().toArray();

        const paginated = collections.slice(offset, +offset + +limit);
        const data = await Promise.all(paginated.map(async c => ({ name: c.name, count: await db.collection(c.name).countDocuments() })));

        return res.status(200).json({ data: data });
    } catch (error) {
        console.error('Error in /api/collections:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}