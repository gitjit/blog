import { Component } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const API_ENDPOINT = "https://localhost:5001/weatherforecast/city/";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styles: [],
})
export class AppComponent {
  title = "JitBoxNg";
  city = "";
  temp = "";
  summary = "";

  constructor(private authService: MsalService, private http: HttpClient) {}

  ngOnInit(): void {}

  onApiCall() {
    console.log("Api call");
    if (this.authService.getAccount()) {
      this.city = this.authService.getAccount().idTokenClaims.city;
    }
    this.authService
      .acquireTokenSilent({
        scopes: ["https://jitbox.onmicrosoft.com/api/read_data"],
      })
      .then((result: any) => {
        console.log(result);
        this.http
          .get(API_ENDPOINT + this.city, {
            responseType: "text",
            headers: new HttpHeaders({
              Authorization: "Bearer " + result.accessToken,
            }),
          })
          .subscribe(
            (result) => {
              console.log(result);
              var res = JSON.parse(result);
              this.temp = res.temp;
              this.summary = res.summary;
            },
            (error) => console.log(error)
          );
      });
  }
}
