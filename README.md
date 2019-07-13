
Angular IdentityServer WebAPI
=========

This repo consist of 3 basic projects. Client, Authentication Service and a WebAPI. The reason I used 3 separate project is to simulate
a scenario where the client access an already existing api and an authentication service.

## Features

* Token based authentication
* Web API access
* Login, Register & Change password
* Form input validation
* Angular Material Design

## Live demo

[Live demo][d1]

## Steps to run the project
Note: First time you open the projet, it will install / download / restore all the dependencies (2 - 5mins) depending on your internet speed. <br />

After Visual Studio installed all the dependencies 
1. In Visual Studio run the project `IdentityServer`
2. In Visual Studio run the project `WebAPI`
3. Open cmd/powershell or any other command line interface and navigate to `Angular-IdentityServer-WebAPI/src/Angular/ClientApp` then type `npm install`.
4. then type the command `ng serve` to run the angular app.
5. Open your browser and navigate to `localhost:4200`

## What's included

* Angular
* Webpack
* ASP.NET Core
* IdentityServer
* Angular2-jwt
* Material

## References

[http://docs.identityserver.io/en/release/quickstarts/0_overview.html][ref1]<br>
[https://github.com/auth0/angular2-jwt][ref2]<br>
[http://blog.ionic.io/ionic-2-and-auth0/][ref3]<br>
[https://auth0.com/docs/quickstart/spa/angular2][ref4]<br>
[http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields/34582914#34582914][ref5]<br>
[https://angular.io/docs/ts/latest/guide/router.html#!#teach-authguard-to-authenticate][ref6]<br>
[https://angular.io/docs/ts/latest/cookbook/form-validation.html#!#reactive][ref7]<br>
[https://github.com/angular/material2][ref8]<br>

## License

MIT

[d1]: https://angular-d1.azurewebsites.net
[ref1]: http://docs.identityserver.io/en/release/quickstarts/0_overview.html
[ref2]: https://github.com/auth0/angular2-jwt
[ref3]: http://blog.ionic.io/ionic-2-and-auth0
[ref4]: https://auth0.com/docs/quickstart/spa/angular2
[ref5]: http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields/34582914#34582914
[ref6]: https://angular.io/docs/ts/latest/guide/router.html#!#teach-authguard-to-authenticate
[ref7]: https://angular.io/docs/ts/latest/cookbook/form-validation.html#!#reactive
[ref8]: https://github.com/angular/material2
