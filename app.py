from io import BufferedReader
import os
from dotenv import load_dotenv
from tusclient import client
from supabase import create_client

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")


def upload_file(
    bucket_name: str, file_name: str, file: BufferedReader, access_token: str
):
    # create Tus client
    my_client = client.TusClient(
        f"{supabase_url}/storage/v1/upload/resumable",
        headers={"Authorization": f"Bearer {access_token}", "x-upsert": "true"},
    )
    uploader = my_client.uploader(
        file_stream=file,
        chunk_size=(6 * 1024 * 1024),
        metadata={
            "bucketName": bucket_name,
            "objectName": file_name,
            "contentType": "image/png",
            "cacheControl": "3600",
        },
    )
    uploader.upload()


def main() -> None:
    # create client and sign in
    supabase = create_client(supabase_url, supabase_key)
    supabase.auth.sign_in_with_password(
        {"email": "up+rosamond_damore@example.com", "password": "password123"}
    )

    # get session
    session = supabase.auth.get_session()

    # open file and send file stream to upload
    with open("./assets/40mb.jpg", "rb") as fs:
        upload_file(
            bucket_name="assets",
            file_name="large_file",
            file=fs,
            access_token=session.access_token,
        )


main()
