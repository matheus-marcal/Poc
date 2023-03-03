require('dotenv').config()
const { BlobServiceClient } = require("@azure/storage-blob");


const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
const storageAccountName = process.env.AZURE_STORAGE_RESOURCE_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;


const blobServiceClient = new BlobServiceClient(uploadUrl);

async function main() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const json={
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "films": [
      "https://swapi.dev/api/films/2/",
      "https://swapi.dev/api/films/6/",
      "https://swapi.dev/api/films/3/",
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/7/"
    ],
    "species": [
      "https://swapi.dev/api/species/1/"
    ],
    "vehicles": [
      "https://swapi.dev/api/vehicles/14/",
      "https://swapi.dev/api/vehicles/30/"
    ],
    "starships": [
      "https://swapi.dev/api/starships/12/",
      "https://swapi.dev/api/starships/22/"
    ],
    "created": "2014-12-09T13:50:51.644000Z",
    "edited": "2014-12-20T21:17:56.891000Z",
    "url": "https://swapi.dev/api/people/1/"
  }
  const content = JSON.stringify(json);
  const blobName = "teste/newblob" + new Date().getTime()+".json";
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}

main();