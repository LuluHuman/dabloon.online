const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require("./config.json")
const { uri } = config.mongodb

exports.read = async function (open_id) {
    const client = await MongoClient.connect(uri).catch((err) => console.log(err.Message))
    // Use admin request
    const collection = client.db("tiktok").collection("users")
    const result = await collection.find({ open_id: open_id }).toArray()
    if (!result[0]) return null
    if (result[0].open_id !== open_id) return null
    client.close()
    return result[0]
}

exports.write = async function (data) {
    const client = await MongoClient.connect(uri).catch((err) => console.log(err.Message))
    const collection = client.db("tiktok").collection("users")
    const cheakFordb = await this.read(data.open_id)
    console.log(cheakFordb);
    if (!cheakFordb) {
        await collection.insertOne(data);
        console.log(true);
        return
    }

    collection.updateOne({ open_id: data.open_id }, { $set: data })
    console.log("saved for user " + data.display_name);
    setTimeout(() => {
        client.close()
    }, 5000);

    return true
}

exports.tradeWrite = async function (data, objid) {
    const client = await MongoClient.connect(uri).catch((err) => console.log(err.Message))
    const collection = client.db("tiktok").collection("trade")
    var res
    if (!objid) {
        res = await collection.insertOne(data);
    } else {
        res = await collection.updateOne({ _id: objid }, { $set: data })
    }
    setTimeout(() => {
        client.close()
    }, 5000);

    return res
}

exports.tradeRead = async function (filter) {// oid: to_open_id || from_open_id,, type: to || from
    const client = await MongoClient.connect(uri).catch((err) => console.log(err.Message))
    const collection = client.db("tiktok").collection("trade")
    const result = filter._id ? await collection.findOne(filter) : await collection.find(filter).toArray();
    console.log(result, filter);
    setTimeout(() => {
        client.close()
    }, 5000);

    return result
}

//      *Example Usage*         //
//          read                //
/*
const database = require("./private/database")
database.read("<openId>").then((res) => {
    console.log(res);
})

example of openId:
723f24d7-e717-40f8-a2b6-cb8464cd23b4
*/

//------------------------------//
//      *Example Usage*         //
//          writw               //
/*
const database = require("./private/database")
database.write({open_id:<open_id>, display_name:<display_name>}).then((res) => {
    console.log(res);
})

example of
open_id:
723f24d7-e717-40f8-a2b6-cb8464cd23b4 ?: typically found after titok callack
display_name:
masonhuamn ?:typically found after titok callack
*/
