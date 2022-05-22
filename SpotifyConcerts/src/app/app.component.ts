import { Component } from '@angular/core';
import { SpotifyService } from './services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SpotifyConcerts';
  token = '';
  topArtists: any[] = [];
  authorized: boolean = false;
  constructor(private _spotifyService: SpotifyService) { }

  //on refresh, set url back to http://localhost:4200/
  refresh() {
    window.location.href = 'http://localhost:4200/';
  }

  ngOnInit() {
    if (this.getCodeFromQueryString() != 'notFound') {
      this._spotifyService.getAuth(this.getCodeFromQueryString()).subscribe(res => {
        if (res.access_token != undefined) {
          this._spotifyService.getTopArtists(res.access_token).subscribe(res => {
              this.topArtists = res.items;
              this.authorized = true;
            });
        }
      });
    }
  }

  getCodeFromQueryString() {
    let code = '';
    if (window.location.href.indexOf('code') > -1) {
      code = window.location.href.split('code=')[1].split('&')[0];
    }
    else {
      return 'notFound';
    }
    return code;
  }

  // getCodeFromQueryString() {
  //   let url = window.location.href;
  //   let params = url.split('?')[1];
  //   let code = params[0].split('=')[1];
  //   return code;
  // }

  authorize() {
    window.location.href = this._spotifyService.buildSpotifyAuthorizeUrl();
  }
}
