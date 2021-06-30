require('dotenv').config()
const Fetch = require("node-fetch");
const FormData = require("form-data");

const UploadFile = async (props) => {
    const response = await Fetch(props.url);
    const buffer = await response.buffer();
    const url = `https://uploads.slate.host/api/public/${props.collection}`;

    let data = new FormData();
    data.append("data", buffer, { filename: `${props.screen_name}-reddit.${props.file_type}` });
    const upload = await Fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${props.api}`,
        },
        body: data
    });

    const json = await upload.json();

    let fileMeta = json.data;

    fileMeta.data = {
        source: props.source,
        name: `${props.screen_name} - ${props.created_at}`,
        body: props.description,
        author: props.profileLink
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

const getData = async (props) => {
    let num = Math.floor(Math.random() * props.pages);
    let cooper = Fetch(`https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=8f04736a062947e5df2148506bec15ef&query=${props.query}&page=${num}&per_page=20`)
    .then(response => {
        return response.json();
    })
    return cooper;
}

export default async function handler(req, res) {

    const { query: { query, api, collection }} = req;

    function objectValues(obj) {
        let vals = [];
        for (const prop in obj) {
            vals.push(obj[prop]);
        }
        return vals;
    }
    
    let cooper = await getData({ pages: 20, query: query });
    let object = cooper.objects[Math.floor(Math.random()*cooper.objects.length)];
    let images = object.images[0];   

    let image;
    let obj = Object.entries(images);
    obj[1].forEach(element => {
        console.log(element);
        if(element.url) {
            image = element.url;
        }
    });

    let description = `${object.title} - ${object.description}\n\nAccession Number: ${object.accession_number}`;
    let fileType = image.slice(-3);

    let upload = await UploadFile({
        url: image,
        source: object.url,
        created_at: object.date,
        screen_name: object.participants[0].person_name,
        description: description,
        profileLink: object.participants[0].person_url,
        file_type: fileType,
        api: api,
        collection: collection,
    }); 

    return res.status(200).json({ data: upload })
    
};