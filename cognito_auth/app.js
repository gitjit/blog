
const signUp = () => {
    event.preventDefault();
    console.log("signup");
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = document.querySelector("#username").value;
    const emailadd = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    var email = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: emailadd,
    });
  
    userPool.signUp(username, password, [email], null, function (err, result) {
      if (err) {
        alert(err);
      } else {
        location.href = "confirm.html#" + username;
      }
    });
  };

  const confirmCode = () => {
    event.preventDefault();
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = location.hash.substring(1);
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });
    const code = document.querySelector("#confirm").value;
    console.log("code =" + code);
    cognitoUser.confirmRegistration(code, true, function (err, results) {
      if (err) {
        alert(err);
      } else {
        console.log("confirmed");
        location.href = "signin.html";
      }
    });
  };

  const resendCode = () => {
    event.preventDefault();
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = location.hash.substring(1);
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.resendConfirmationCode(function (err) {
      if (err) {
        alert(err);
      }
    });
  };

  const signIn = () => {
    event.preventDefault();
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
  
    let authenticationData = {
      Username: username,
      Password: password,
    };
  
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: username,
      Pool: userPool,
    };
  
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function () {
        console.log("login success");
        location.href = "index.html";
      },
      onFailure: function (err) {
        alert(JSON.stringify(err));
      },
    });
  };
  
  const signOut = () => {
    console.log("sign out");
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) cognitoUser.signOut();
  };

  const checkLogin = () => {
    console.log("checking login..");
    const login = false;
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userBtn = document.querySelector(".user");
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        userBtn.innerHTML += cognitoUser.username;
    } 
  };