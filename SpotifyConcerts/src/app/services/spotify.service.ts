import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private searchUrl!: string;
  private artistUrl!: string;
  private albumsUrl!: string;
  private albumUrl!: string;
  private clientId: string = '1873a5b886c34f51927a2e4f395f19bc';
  private clientSecret: string = 'a52e41f220e042b6a6a3dadab9366ac3';
  private body: any;

  constructor(private _http: HttpClient) { }

  authorize() {
    let headers = new HttpHeaders(
      {
        'Access-Control-Allow-Origin': '*'
      });

    let params = new HttpParams()
      .set('client_id', this.clientId)
      .set('response_type', 'code')
      .set('redirect_uri', 'http://localhost:4200/callback')
      .set('scope', 'user-read-private user-read-email')
      .set('state', this.randomString(16));

    return this._http.get('https://accounts.spotify.com/authorize?', { headers: headers, params: params });
  }

  randomString(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  // Get access token from Spotify to use API
  getAuth = () => {

    let headers = new HttpHeaders(
      {
        'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      });

    // headers.append('Authorization', 'Basic ' + btoa(this.clientId + ":" + this.clientSecret));
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let params: HttpParams = new HttpParams(
      {
        fromObject: {
          grant_type: 'client_credentials'
        }
      });

    // params.set('grant_type', 'client_credentials');
    // let body = params.toString();

    // return this._http.post('https://accounts.spotify.com/api/token', body, { headers: headers })
    //   .map(res => res.json());

    //return post request as json
    return this._http.post<any>('https://accounts.spotify.com/api/token', params, { headers: headers });
  }

  // Get users top artists
  getTopArtists(authToken: string) {
    let headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      });

    return this._http.get('https://api.spotify.com/v1/me/top/artists?time_range=medium_term', { headers: headers });
  }


  // Get search results for a query
  searchMusic(query: string, type = 'artist', authToken: string) {
    let headers = new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.searchUrl = 'https://api.spotify.com/v1/search?query=' + query + '&offset=0&limit=20&type=' + type + '&market=US';

    return this._http.get(this.searchUrl, { headers: headers });
  }

  // Get data about artist that has been chosen to view
  getArtist(id: string, authToken: string) {
    let headers = new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.artistUrl = 'https://api.spotify.com/v1/artists/' + id;

    return this._http.get(this.artistUrl, { headers: headers });
  }

  // Get the albums about the artist that has been chosen
  getAlbums(id: string, authToken: string) {
    let headers = new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.albumsUrl = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=US&album_type=single';

    return this._http.get(this.albumsUrl, { headers: headers });
  }

  // Get Tracks in ablum selected
   getAlbum(id: string, authToken: string) {
    let headers = new HttpHeaders();
    headers.append('Authorization', 'Bearer ' + authToken);

    this.albumUrl = 'https://api.spotify.com/v1/albums/' + id;

    return this._http.get(this.albumUrl, { headers: headers });
  }
}
