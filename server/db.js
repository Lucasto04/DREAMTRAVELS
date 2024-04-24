import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
export async function login(username,password) {
 const res=  await client
 .db("travels")
 .collection("users")
 .findOne({username,password});
 return [res !=null,res ]

}



export async function connect() {
  await client.connect();
}
export async function close() {
  await client.close();
}