export namespace TOpenid {
  /**
   * Successful Token Response
   * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
   */
  export type Token = {
    /**
     * Access Token enabling retrieval of the Claims from the endpoint URL by using the OAuth 2.0 Bearer Token Usage
     * [RFC6750] protocol.
     */
    access_token: string;
    /**
     * Expiration time of the Access Token in seconds since the response was generated in seconds.
     */
    expires_in: number;
    /**
     * Id Token contains the public claims related with user in JWT format
     */
    id_token: string;
    /**
     * Refresh Token used to refresh session of authentication, returning a new pair openid token.
     */
    refresh_token: string;
    /**
     * The type of token
     */
    token_type: 'Bearer';
  };

  /**
   * Public user profile structure contained in "id_token" in JWT format
   */
  export type Info = {
    /**
     * End-User's preferred email address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
     */
    email: string;
    /**
     * Surname(s) or last name(s) of the End-User.
     */
    family_name?: string;
    /**
     * Given name(s) or first name(s) of the End-User.
     */
    given_name?: string;
    /**
     * String with locale used by user
     */
    locale?: string;
    /**
     * URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF
     * image file), rather than to a Web page containing an image.
     */
    picture?: string;
    /**
     * Subject - Identifier for the End-User at the Issuer.
     */
    sub: string;
    /**
     * Preferred theme of user (saved in application context)
     */
    theme?: string;
    /**
     * String from IANA Time Zone Database representing the End-User's time zone.
     */
    timezone?: string;
  };
}
