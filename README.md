# Gmail MCP Server

[Previous sections remain the same until Usage with Desktop App]

### Usage with Desktop App

To integrate this server with the desktop app, add the following to your app's server configuration:

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": [
        "-y",
        "@lorismaz/gmail-mcp-server"
      ]
    }
  }
}
```

[Rest of the README remains the same]