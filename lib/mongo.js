import { MongoClient } from "mongodb";

const uri = 'mongodb://dbaitest:7V7H7QDFAnX9jg2C@35.165.70.240:27017/new_live_images?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=dbaitest&authMechanism=SCRAM-SHA-256';

let clientPromise;
if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;