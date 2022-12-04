//--Pkg--//:Start
const config = require("./_private/config.json")
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const dbMod = require("./_private/database")
const mongodb = require('mongodb')  //*
const express = require("express")
const axios = require("axios")
const cors = require('cors');
const path = require("path")
const fs = require("fs")

const config_tiktok = config.tiktok
const { clientKey, clientSecret } = config_tiktok
//--Pkg--//:End

var sessions = new Map()
sessions.set("7aboemj1n64", "act.434c16e1e49b69883f2c94ae026e04a6Vomlaflr8IXfPAcyVza3mEZWOGV4!6211")

//--express functions--//:Start
const app = express()
const jsonParser = bodyParser.json()
app.listen(8002, () => console.log('da bloons have begun'))
app.use(bodyParser.json({ type: 'application/json' }))//Body parser
app.use(express.static(__dirname + '/_public/'));
app.use(cookieParser());                                //Cookie parser
app.use(cors());                                        //Cors

app.get('/ttauth', (req, res) => {
    const { code } = req.query;

    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 1 * 60 * 60 * 1000 });

    let url = 'https://www.tiktok.com/auth/authorize/';

    url += `?client_key=${clientKey}`;
    url += '&scope=user.info.basic';
    url += `&response_type=code`;
    url += '&redirect_uri=https://dabloon.online/ttauth/callback';
    url += '&state=' + csrfState;

    res.redirect(url);
})
app.use("/ttauth/callback", async (req, res) => {
    const { code, state } = req.query;
    const { csrfState } = req.cookies;

    if (state !== csrfState) {
        res.status(422).send('Invalid state');
        return;
    }

    let url_access_token =
        (
            'https://open-api.tiktok.com/oauth/access_token/'
            + `?client_key=${clientKey}`
            + `&client_secret=${clientSecret}`
            + '&code=' + code
            + '&grant_type=authorization_code'
        )

    const { data } = await axios.post(url_access_token)
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link,likes_count,following_count,follower_count,is_verified,bio_description', {
        headers: {
            'Authorization': `Bearer ${data.data.access_token}`
        }
    });
    var user = response.data.data.user
    sessions.set(csrfState, data.data.access_token)
    console.log(sessions);

    const storedInfo = await dbMod.read(user.open_id)
    console.log(storedInfo);
    if (!storedInfo) {
        user.dabloons = 0
        user.items = JSON.stringify({
            "welcome_gift": 1
        })
        dbMod.write(user)
        res.redirect("/migrate")

        return
    }

    user.dabloons = storedInfo.dabloons
    user.items = storedInfo.items
    dbMod.write(user)
    res.redirect("/")
})

app.get("/api/getprofile", async (req, res) => {
    if (req.query.open_id) {
        const savedProfile = await dbMod.read(req.query.open_id)
        if (!savedProfile) return res.sendStatus(404)
        res.send(savedProfile)
        return
    }

    const { csrfState } = req.cookies;
    const accesToken = sessions.get(csrfState)
    if (!accesToken) return res.sendStatus(400)
    const url = req.query.only ? 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,' + req.query.only : 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link,likes_count,following_count,follower_count,is_verified,bio_description'
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${accesToken}`
        }
    })
    var user = response.data.data.user
    const savedProfile = await dbMod.read(user.open_id)

    user.dabloons = savedProfile.dabloons
    user.items = savedProfile.items
    res.send(user)
    // if (req.query.only) {
    //     if (!user[req.query.only]) return res.sendStatus(405)
    //     res.send(user[req.query.only])
    //     return
    // }
})

app.put("/api/updateprofile", async (req, res) => {
    const { csrfState } = req.cookies;
    const accesToken = sessions.get(csrfState)
    if (!accesToken) return res.sendStatus(400)
    const body = await req.body
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link,likes_count,following_count,follower_count,is_verified,bio_description', {
        headers: {
            'Authorization': `Bearer ${accesToken}`
        }
    })
    const user = response.data.data.user
    user["dabloons"] = body.dabloons
    user["items"] = body.items
    const storedInfo = await dbMod.write(user)
    console.log(storedInfo);

    res.send(storedInfo)
})

app.get('/profile/:open_id', (req, res) => {
    res.sendFile(path.join(__dirname, "\\_public\\profile\\_open_id\\index.html"))
})

app.delete("/endsession", async (req, res) => {
    const { csrfState } = req.cookies;
    sessions.delete(csrfState)
    res.cookie('csrfState', undefined, { maxAge: 0 });
    res.send(true)
})

app.post("/api/trade", async (req, res) => {
    const { csrfState } = req.cookies;
    const accesToken = sessions.get(csrfState)
    if (!accesToken) return res.sendStatus(400)
    const body = await req.body

    const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,'
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${accesToken}`
        }
    })
    var user = response.data.data.user

    body["from_open_id"] = user.open_id
    body["offer"] = JSON.stringify(body["offer"])
    body["request"] = JSON.stringify(body["request"])
    const storedInfo = await dbMod.tradeWrite(body)
    console.log(storedInfo);

    res.send(storedInfo.acknowledged)
})

app.get("/api/trade", async (req, res) => {
    const { csrfState } = req.cookies;
    const accesToken = sessions.get(csrfState)
    if (!accesToken) return res.sendStatus(400)

    const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,'
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${accesToken}`
        }
    })
    var user = response.data.data.user

    const filter = req.query.type == "to" ? { to_open_id: user.open_id } : { from_open_id: user.open_id }
    const storedInfo = await dbMod.tradeRead(filter)
    console.log(storedInfo);

    res.send(storedInfo)
})

app.get("/api/tradeaction", async (req, res) => {
    const ObjectId = mongodb.ObjectId;

    const { csrfState } = req.cookies;
    const accesToken = sessions.get(csrfState)
    if (!accesToken) return res.sendStatus(400)

    const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,'
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${accesToken}`
        }
    })
    var user = response.data.data.user
    console.log(req.query);
    if (req.query.action == "accept") {
        const filter = { _id: new ObjectId(req.query.objectId) }
        const storedInfo = await dbMod.tradeRead(filter)
        if (storedInfo.completeType) return res.sendStatus(202)
        if (!storedInfo.to_open_id == user.open_id) return res.sendStatus(400)
        const ele = storedInfo
        const to_user = await dbMod.read(user.open_id) //to the user
        const from_user = await dbMod.read(ele.from_open_id)//the person who want to trade

        const to_user_items = JSON.parse(to_user.items)
        const from_user_items = JSON.parse(from_user.items)

        const offer = JSON.parse(ele.offer)
        const request = JSON.parse(ele.request)

        to_user.dabloons = Number(to_user.dabloons) + Number(offer.dabloons)
        from_user.dabloons = Number(from_user.dabloons) - Number(offer.dabloons)

        from_user.dabloons = Number(from_user.dabloons) + Number(request.dabloons)
        to_user.dabloons = Number(to_user.dabloons) - Number(request.dabloons)

        for (let i = 0; i < 4; i++) {
            if (!offer['item' + i] == "") {                                                                                  
                if (Number(from_user_items[offer["item" + i]]) <= 1) {
                    delete from_user_items[offer["item" + i]]
                } else {
                    from_user_items[offer["item" + i]] = from_user_items[offer["item" + i]] - 1
                }

                if (to_user_items[offer["item" + i]]) {
                    Number(to_user_items[offer["item" + i]]) += 1
                } else {
                    to_user_items[offer["item" + i]] = 1
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            if (!request['item' + i] == "") {
                if (Number(to_user_items[request["item" + i]]) <= 1) {
                    delete to_user_items[request["item" + i]]
                } else {
                    to_user_items[request["item" + i]] = to_user_items[request["item" + i]] - 1
                }
                if (from_user_items[request["item" + i]]) {
                    Number(from_user_items[request["item" + i]]) += 1
                }else{
                    from_user_items[request["item" + i]] = 1
                }
            }
        }
        console.log("------------------------------");

        to_user.items = JSON.stringify(to_user_items)
        from_user.items = JSON.stringify(from_user_items)

        const to = await dbMod.write(to_user)
        const from = await dbMod.write(from_user)

        storedInfo.completeType = "Accepted"
        dbMod.tradeWrite(storedInfo, storedInfo._id)
        if(to && from) return res.sendStatus(200)
        res.sendStatus(400)
    } else if (req.query.action == "declined"){
        const filter = { _id: new ObjectId(req.query.objectId) }
        const storedInfo = await dbMod.tradeRead(filter)

        if (storedInfo.completeType) return res.sendStatus(202)
        if (!storedInfo.to_open_id == user.open_id) return res.sendStatus(400)

        storedInfo.completeType = "Declined"
        dbMod.tradeWrite(storedInfo, storedInfo._id)
    }
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/_public/_backend/404.html"))
})
//--express functions--//:End