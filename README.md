# Authorization Code Exchange
This page is used as the final redirect page for an authorization code flow.  It will attempt to exchange the authorization code found in the URL for a token.  Depending on client configuration, the token could either be a reference or JWT token.

## How to use

- Copy the auth-test-site.conf file to your nginx configuration directory and restart nginx
- Generate an authorization request, similar to `http://devauth.daptiv.com/connect/authorize?redirect_uri=http%3A%2F%2Fdevauthcode.daptiv.com%2F&client_id=idsrvauthcode&response_type=code&scope=openid%20ppm%20offline_access&state=57f890eee56a49418129d2c9a08f9a4d`
- Complete the login using valid dev PPM credentials
- Observe the exchanged token.

## Clients
Here are 2 client configuration JSON blobs that will work with the Auth service

### Reference
```
{
    "Id": "idsrvauthcode",
    "Name": "Test Authorization Code Flow",
    "Secret": "password",
    "Flow": "AuthorizationCode",
    "AccessTokenType": "Reference",
    "LocalLogin": true,
    "RequireConsent": false,
    "AllowRememberConsent": false,
    "ClientClaims": false,
    "AccessTokenLifetime": 604800,
    "RefreshTokenLifetime": 2592000,
    "RedirectUris": [
      "http://devauthcode.daptiv.com/"
    ],
    "AllowedScopes": [
      "openid",
      "ppm",
      "offline_access"
    ]
}
```

### JWT
```
{
    "Id": "idsrvauthcode",
    "Name": "Test Authorization Code Flow",
    "Secret": "password",
    "Flow": "AuthorizationCode",
    "AccessTokenType": "Jwt",
    "LocalLogin": true,
    "RequireConsent": false,
    "AllowRememberConsent": false,
    "ClientClaims": false,
    "AccessTokenLifetime": 604800,
    "RefreshTokenLifetime": 2592000,
    "RedirectUris": [
      "http://devauthcode.daptiv.com/"
    ],
    "AllowedScopes": [
      "openid",
      "ppm",
      "offline_access"
    ]
}
```

# Notes
A note about security: These clients are considered to not be confidential, since the application consuming them cannot guarantee the privacy of the client secret.  In no way should a client that requires confidentiality be used in this scenario.  Hence the password on these clients is simply "password" - it is consumable by the user, so no attempt is or should be made to conceal it.

Authorization Code and Implicit Code flows are meant to used with non-confidential clients and applications, such as JavaScript applications (like SPA's, etc.)

