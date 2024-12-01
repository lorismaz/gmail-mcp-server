# Gmail MCP Server

[Previous sections remain the same until Usage with Claude Desktop]

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": [
        "-y",
        "gmail-mcp-server"
      ],
      "env": {
        "GOOGLE_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "GOOGLE_CLIENT_SECRET": "<YOUR_CLIENT_SECRET>",
        "GOOGLE_REDIRECT_URI": "http://localhost:3000/auth/google/callback",
        "PORT": "3000"
      }
    }
  }
}
```

You'll need to obtain your Google OAuth2 credentials from the Google Cloud Console:
1. Create a project in Google Cloud Console
2. Enable the Gmail API
3. Create OAuth2 credentials (Web application type)
4. Add http://localhost:3000/auth/google/callback to the authorized redirect URIs
5. Copy the Client ID and Client Secret into your configuration

[Rest of the README remains the same]