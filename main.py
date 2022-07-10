from dotenv import load_dotenv
import os
import tekore as tk 


load_dotenv()


def spotify_login():

    app_token = tk.request_client_token(os.environ.get("CLIENT_ID"),os.environ.get("CLIENT_SECRET"))

    spotify = tk.Spotify(app_token)
    album = spotify.search("Abbey Road")

    client_id = os.environ.get("CLIENT_ID")
    client_secret = os.environ.get("CLIENT_SECRET")


    user_token = tk.prompt_for_user_token(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri="http://localhost:8080",
        scope = tk.scope.every
    )

    spotify.token=user_token
    return spotify


