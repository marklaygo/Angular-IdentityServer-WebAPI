// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const globalEndPoint = {
  AuthEndPoint: 'http://localhost:5000',
  ApiEndPoint: 'http://localhost:5001',
}

export const environment = {
  production: false,

  // token
  TokenName: 'access_token',
  Token_Endpoint: globalEndPoint.AuthEndPoint + '/connect/token',
  UserInfo_Endpoint: globalEndPoint.AuthEndPoint + '/connect/userinfo',
  Client_Id: 'Angular',
  Grant_Type_Password: 'password',
  Grant_Type_RefreshToken: 'refresh_token',
  Scope: 'api1 offline_access openid profile accountApi',

  // account
  Register_Endpoint: globalEndPoint.AuthEndPoint + '/api/account/register',
  ChangePassword_Endpoint: globalEndPoint.AuthEndPoint +  '/api/account/changepassword',

  // api
  NumbersApi_Endpoint: globalEndPoint.ApiEndPoint + '/api/numbers',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
