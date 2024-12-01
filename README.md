# Gmail MCP Server

A Model Context Protocol (MCP) server implementation that allows LLMs to search and retrieve Gmail emails through a standardized API.

## Features

- Implements MCP v1 specification for email context retrieval
- Gmail API integration with OAuth2 authentication
- Email search functionality
- Secure credential management through environment variables
- TypeScript implementation for type safety

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account with Gmail API enabled
- OAuth2 credentials from Google Cloud Console

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
      ]
    }
  }
}
```

### Available Tools
- `search` - Searches Gmail emails and returns their content
    - `q` (string, required): Search query using Gmail search syntax
    - `max_results` (integer, optional): Maximum number of emails to return (default: 10)

### Prompts
- **search_emails**
  - Search Gmail emails using Gmail search syntax
  - Arguments:
    - `query` (string, required): Search query string
    - `max_results` (integer, optional): Maximum number of results to return

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gmail-mcp-server.git
cd gmail-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Google OAuth2 credentials:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
PORT=3000
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Authentication

1. Visit `http://localhost:3000/auth/google` to start the OAuth2 flow
2. Allow the application access to your Gmail account
3. You'll be redirected back to the application with successful authentication

## API Usage

### Get Email Context

```http
GET /api/v1/context?q=search_query
```

Parameters:
- `q` (required): Search query string (follows Gmail search syntax)

Example response:
```json
{
  "results": [
    {
      "content": "Email snippet text...",
      "metadata": {
        "source": "gmail",
        "id": "email_id",
        "headers": [
          {
            "name": "Subject",
            "value": "Email subject"
          },
          {
            "name": "From",
            "value": "sender@example.com"
          }
        ]
      }
    }
  ]
}
```

## Debugging

You can use the MCP inspector to debug the server:
```bash
npx @modelcontextprotocol/inspector npx gmail-mcp-server
```

Or if you've installed the package in a specific directory:
```bash
cd path/to/gmail-mcp-server
npx @modelcontextprotocol/inspector npm run dev
```

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement rate limiting for production use
- Consider implementing token refresh logic
- Add error handling for expired tokens

## Development

To contribute:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - feel free to use and modify as needed.