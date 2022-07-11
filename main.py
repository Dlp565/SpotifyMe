from dotenv import load_dotenv
import os
import tekore as tk 
import pickle
import matplotlib.pyplot as plt

load_dotenv()


def spotify_login():

    app_token = tk.request_client_token(os.environ.get("CLIENT_ID"),os.environ.get("CLIENT_SECRET"))

    spotify = tk.Spotify(app_token)
    
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

def top_songs(timeframe):
    top = []
    global spotify
    if timeframe == 0:
        songs = spotify.current_user_top_tracks(limit=10,time_range='short_term')
    elif timeframe == 1:
        songs = spotify.current_user_top_tracks(limit=10,time_range='medium_term')
    else:
        songs = spotify.current_user_top_tracks(limit=10,time_range='long_term')
    i = 1
    for song in songs.items:
        curr_tuple= [song.name,song.artists[0].name,song.album.name]
        top.append(curr_tuple)
        
    return top

def top_songs_artist_pi(top_songs):
    artist_dict = {}
    for row in top_songs:
        artist = row[2]
        if artist in artist_dict:
            artist_dict[artist] +=1
        else:
            artist_dict[artist] = 1

    labels = []
    sizes = []
    for artist, count in artist_dict.items():
        labels.append(artist)
        sizes.append(count)
    
    plt.pie(sizes,labels=labels)
    plt.axis('equal')
    plt.show()
    
spotify = spotify_login() 
top = top_songs(1)
top_songs_artist_pi(top)



