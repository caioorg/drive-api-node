const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if(err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listFiles);
})

function authorize(credentials, callback) {

  const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    )

    fs.readFile(TOKEN_PATH, (err, token) => {    
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    })
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Upload file.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {name} name It requires passar or file name that separates feito or upload.
 * @param {extension} ext File extension type.
 * @param {path} filePath To perform the upload, the file must be at the root of the project.
 * @param {mimeType} type Define what type of file is being sent
 */
function uploadFile(auth, name, ext, filePath, type) {
    console.log('==================================')
    
    const drive = google.drive('v3');
    const fileMetadata = {
        'name': `${name}.${ext}`,
        /**
          * If you wanted to send a specific paste
          * @param {parents} FOLDER_ID An authorized OAuth2 client.
          * parents: ['FOLDER_ID']
          */
    }

    const media =  {
        mimeType: type,
        body: fs.createReadStream(filePath)
    }
    
    drive.files.create({
        auth,
        resource: fileMetadata,
        media,
    }, (err, file) => {
            if (err) return console.log('The API returned an error: ' + err);
            else return console.log('upload complete!');
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    
    uploadFile(auth, 'upload-file-drive-api', 'jpg', 'example.jpg', 'image/jpg')

    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}