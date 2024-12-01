# Gmail MCP Server

A Model Context Protocol server implementation that allows LLMs to search and retrieve Gmail emails.

## Components

### Tools
- **search**
  - Search for emails in Gmail
  - Input: 
    - `query` (string, required): Search query using Gmail search syntax
    - `maxResults` (number, optional): Maximum number of results to return (default: 10)
  - Returns email snippets with subject and sender information

## Getting started

1. [Create a new Google Cloud project](https://console.cloud.google.com/projectcreate)
2. [Enable the Gmail API](https://console.cloud.google.com/workspace-api/products)
3. [Configure an OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) ("internal" is fine for testing)
4. Add OAuth scope `https://www.googleapis.com/auth/gmail.readonly`
5. [Create an OAuth Client ID](https://console.cloud.google.com/apis/credentials/oauthclient) for application type "Desktop App"
6. Download the JSON file of your client's OAuth keys
7. Rename the key file to `gcp-oauth.keys.json` and place into the root of this repo

Make sure to build the server with either `npm run build` or `npm run watch`.

### Authentication

To authenticate and save credentials:
1. Run the server with the `auth` argument: `node ./dist auth`
2. This will open an authentication flow in your system browser
3. Complete the authentication process
4. Credentials will be saved in the root of this repo as `.gmail-server-credentials.json`

### Usage with Desktop App

To integrate this server with the desktop app, add the following to your app's server configuration:

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-gmail"
      ]
    }
  }
}
```

## Development

To build the project:
```bash
npm run build
```

To watch for changes during development:
```bash
npm run watch
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.