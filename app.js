import { createClient } from '@supabase/supabase-js'
import tus from 'tus-js-client'
import fs from 'node:fs/promises'
import { config } from '@dotenvx/dotenvx'

config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = await createClient(supabaseUrl, supabaseKey)

async function uploadFile(bucketName, fileName, file) {
    const { data: { session } } = await supabase.auth.getSession()

    return new Promise((resolve, reject) => {
        var upload = new tus.Upload(file, {
            endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                authorization: `Bearer ${session.access_token}`,
                'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
            metadata: {
                bucketName: bucketName,
                objectName: fileName,
                contentType: 'image/png',
                cacheControl: 3600,
            },
            chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
            onError: function (error) {
                console.log('Failed because: ' + error)
                reject(error)
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
                console.log(bytesUploaded, bytesTotal, percentage + '%')
            },
            onSuccess: function () {
                console.log('Download %s from %s', upload.file.name, upload.url)
                resolve()
            },
        })


        // Check if there are any previous uploads to continue.
        return upload.findPreviousUploads().then(function (previousUploads) {
            // Found previous uploads so we select the first one.
            if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
            }

            // Start the upload
            upload.start()
        })
    })
}

async function main() {
    // signin
    const { data, error } = await supabase.auth.signInWithPassword({email: "up+rosamond_damore@example.com", password: "password123"})
    // upload a file
    try {
        const data = await fs.readFile('./assets/40mb.jpg')
        await uploadFile('assets', 'image_40', data)
    } catch (err) {
        console.log(err)
    }
}

main()
