# Gmail MCP Server

[Previous README content...]

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

[Rest of previous README content...]