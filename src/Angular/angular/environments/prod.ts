export class environment {

    // private

    private static readonly AuthEndPoint: string = 'https://identityserver-d1.azurewebsites.net';
    private static readonly ApiEndPoint: string = 'https://webapi-d1.azurewebsites.net';

    // token

    public static readonly TokenName: string = 'access_token';

    public static readonly Token_Endpoint: string = environment.AuthEndPoint + '/connect/token';

    public static UserInfo_Endpoint: string = environment.AuthEndPoint + '/connect/userinfo';

    public static readonly Client_Id: string = 'Angular';

    public static readonly Grant_Type_Password: string = 'password';

    public static readonly Grant_Type_RefreshToken: string = 'refresh_token';

    public static readonly Scope: string = 'api1 offline_access openid profile accountApi';

    // account

    public static Register_Endpoint: string = environment.AuthEndPoint + '/api/account/register';


    public static ChangePassword_Endpoint: string = environment.AuthEndPoint + '/api/account/changepassword';

    // api

    public static NumbersApi_Endpoint: string = environment.ApiEndPoint + '/api/numbers';

}
