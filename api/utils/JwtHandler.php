<?php
class JwtHandler {
    protected $jwt_secret;
    protected $token;
    protected $issuedAt;
    protected $expire;
    protected $jwt;

    public function __construct() {
        // Set your JWT secret key here
        $this->jwt_secret = "your_jwt_secret_key"; // TODO: replace
        
        // Set the time that the token was issued at
        $this->issuedAt = time();
        
        // Set the expiration time - 24 hours (86400 seconds) from issue time
        $this->expire = $this->issuedAt + 86400;
    }

    // Create JWT token
    public function generateToken($data) {
        $this->token = array(
            // Header
            "iat" => $this->issuedAt, // Issued at: time when token was generated
            "exp" => $this->expire,   // Expiration time
            // Payload
            "data" => $data           // Data related to the user
        );

        $this->jwt = $this->encode($this->token, $this->jwt_secret);
        
        return $this->jwt;
    }

    // Encode JWT token (implementation of JWT encoding)
    private function encode($payload, $key) {
        // Create token header
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        // Encode Header
        $base64UrlHeader = $this->base64UrlEncode($header);
        
        // Encode Payload
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));
        
        // Create Signature Hash
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $key, true);
        
        // Encode Signature to Base64Url String
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }

    // Decode JWT token
    public function decode($jwt_token) {
        // Split the token
        $tokenParts = explode('.', $jwt_token);
        
        // Check if the token has three parts
        if (count($tokenParts) != 3) {
            return false;
        }
        
        $header = $this->base64UrlDecode($tokenParts[0]);
        $payload = $this->base64UrlDecode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];
        
        // Verify the signature
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->jwt_secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        // Verify signature
        if ($base64UrlSignature !== $signatureProvided) {
            return false;
        }
        
        $payload = json_decode($payload, true);
        
        // Check if token has expired
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }

    // Helper functions for Base64URL encoding/decoding
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}