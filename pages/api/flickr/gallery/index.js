require('dotenv').config()
const Fetch = require("node-fetch");
const FormData = require("form-data");
const Flickr = require('flickr-sdk');

const UploadFile = async (props) => {
	console.log('props', props)
    const response = await Fetch(props.url);
    const buffer = await response.buffer();
    const url = `https://uploads.slate.host/api/public/${props.collection}`;

    let data = new FormData();
    data.append("data", buffer, { filename: `${props.screen_name}-flickr.jpeg` });
    const upload = await Fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${props.api}`,
        },
        body: data
    });

    const json = await upload.json();

    let fileMeta = json.data;
    let profileLink = `https://flickr.com/photos/${props.path}`;
    

    fileMeta.data = {
        source: props.source,
        name: `${props.screen_name} - Taken: ${props.created_at}`,
        body: props.description,
        author: profileLink
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

	const { query: { ids, api, collection }} = req;

	//console.log('ids:', ids)
	var nameArr = ids.split(',');
	var randomItem = nameArr[Math.floor(Math.random()* nameArr.length)];
	console.log('randomItem1234: ', randomItem)

	var flickr = new Flickr('9ce09b32368da91bdaafcf9c706f1d19');

	flickr.galleries.getPhotos({ gallery_id: randomItem }).then(async (main) => {

		const num = main.body.photos.total - 1;
		const rndInt = Math.floor(Math.random() * num);
		//console.log(rndInt)

		let photoId = main.body.photos.photo[rndInt].id;
		//console.log('data::::', main.body.photos.photo[rndInt])
		var photoTitle = main.body.photos.photo[rndInt].title;

		flickr.photos.getInfo({ photo_id: photoId }).then(async (photoData) => {
			//console.log('photo 12341234: ', photoData.body)
			var data = photoData.body;

			flickr.photos.getSizes({ photo_id: photoData.body.photo.id }).then(async (photo) => {
			  console.log('yay!!!!!!!!!', data.photo.owner.path_alias);
			  console.log('owner!!!!!!!!!', data.photo.owner);
			  let photo123 = photo.body.sizes.size;

			  const imageSize = photo123.filter(photo => photo.label == 'Original' || photo.label == 'Large');

			  if(!imageSize) {
			  	return res.status(200).json({ error: 'No image file found' })
			  }

			  const description = data.photo.title._content + data.photo.description._content;
			  //console.log('description', description)

			  const photoUrl = imageSize[0].source;
			
			  let upload = await UploadFile({
			  	url: photoUrl,
		        source: data.photo.urls.url[0]._content,
		        created_at: data.photo.dates.taken,
		        screen_name: data.photo.owner.username,
		        path: data.photo.owner.nsid,
		        description: description,
		        api: api,
		        collection: collection,
			  })
			  

			  return res.status(200).json({ data: upload })

			});
		});	
	});
}