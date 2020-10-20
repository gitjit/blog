import { Component, OnInit } from "@angular/core";
import { MsalService, BroadcastService } from "@azure/msal-angular";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  accountName = "";
  isLoggedIn = false;
  passwordResetAuthority =
    "https://jitbox.b2clogin.com/jitbox.onmicrosoft.com/B2C_1_pwreset";
  subscriptions: Subscription[] = [];

  constructor(
    private authService: MsalService,
    private broadcastService: BroadcastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    let loginSuccessSubscription: Subscription;
    let loginFailureSubscription: Subscription;

    loginSuccessSubscription = this.broadcastService.subscribe(
      "msal:loginSuccess",
      (success) => {
        // We need to reject id tokens that were not issued with the default sign-in policy.
        // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
        // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
        if (success.idToken.claims["acr"] === "B2C_1_susi") {
          window.alert(
            "Password has been reset successfully. \nPlease sign-in with your new password"
          );
          return this.authService.logout();
        }
        console.log(
          "login succeeded. id token acquired at: " + new Date().toString()
        );
        console.log(success);
        this.checkAccount();
      }
    );

    loginFailureSubscription = this.broadcastService.subscribe(
      "msal:loginFailure",
      (error) => {
        console.log("login failed");
        console.log(error);

        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        if (error.errorMessage.indexOf("AADB2C90118") > -1) {
          {
            this.authService.loginPopup({
              authority: this.passwordResetAuthority,
            });
          }
        }
        this.checkAccount();
      }
    );

    this.subscriptions.push(loginSuccessSubscription);
    this.subscriptions.push(loginFailureSubscription);
    this.checkAccount();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onLogin() {
    if (this.isLoggedIn) {
      this.authService.logout();
    } else {
      this.authService
        .loginPopup()
        .then((result) => {
          console.log("Login success", result);
        })
        .catch((err) => {
          console.log("Login failed : ", err);
        });
    }
  }

  checkAccount() {
    this.isLoggedIn = !!this.authService.getAccount();
    if (this.isLoggedIn) {
      this.accountName = this.authService.getAccount().name;
    } else {
      this.accountName = "";
    }
  }
}
