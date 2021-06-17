require('dotenv').config()
const Fetch = require("node-fetch");
const FormData = require("form-data");
const { reddit } = require("reddit.images");

const UploadFile = async (props) => {
    const response = await Fetch(props.url);
    const buffer = await response.buffer();
    const url = `https://uploads.slate.host/api/public/${props.collection}`;

    let data = new FormData();
    data.append("data", buffer, { filename: `${props.screen_name}-reddit.jpeg` });
    const upload = await Fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${props.api}`,
        },
        body: data
    });

    const json = await upload.json();

    let fileMeta = json.data;
    console.log(fileMeta)

    fileMeta.data = {
        source: props.source,
        name: `${props.screen_name} r/art`,
        body: props.description,
        author: props.screen_name
    };

    const responseMeta = await Fetch('https://slate.host/api/v2/update-file', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${props.api}`,
        },
        body: JSON.stringify({ data: fileMeta }),
    });
    
    return fileMeta;
};

export default function handler(req, res) {
  const { query: { subreddit, api, collection }} = req;

  reddit.FetchSubredditPost(subreddit, "hot").then(async (data) => {
    console.log(data);

    let upload = await UploadFile({
        url: data.image,
        source: data.postLink,
        created_at: data.createdUtc,
        screen_name: data.author,
        description: data.title,
        api: api,
        collection: collection,
    });

    return res.status(200).json({ data: data })
  });
};