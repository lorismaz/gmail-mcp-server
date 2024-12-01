#!/usr/bin/env node

import { authenticate } from "@google-cloud/local-auth";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import { google } from "googleapis";
import path from "path";

const gmail = google.gmail("v1");

const server = new Server(
  {
    name: "example-servers/gmail",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search",
        description: "Search for emails in Gmail",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query using Gmail search syntax",
            },
            maxResults: {
              type: "number",
              description: "Maximum number of results to return",
              default: 10
            }
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search") {
    const userQuery = request.params.arguments?.query as string;
    const maxResults = request.params.arguments?.maxResults as number || 10;
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: userQuery,
      maxResults: maxResults
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!
        });
        return {
          id: email.data.id,
          snippet: email.data.snippet,
          headers: email.data.payload?.headers
        };
      })
    );

    const emailList = emails.map(email => {
      const subject = email.headers?.find(h => h.name === 'Subject')?.value || 'No subject';
      const from = email.headers?.find(h => h.name === 'From')?.value || 'Unknown sender';
      return `From: ${from}\nSubject: ${subject}\n${email.snippet}\n---`;
    }).join('\n\n');

    return {
      content: [
        {
          type: "text",
          text: `Found ${emails.length} emails:\n\n${emailList}`,
        },
      ],
      isError: false,
    };
  }
  throw new Error("Tool not found");
});

const credentialsPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../../../.gmail-server-credentials.json",
);

async function authenticateAndSaveCredentials() {
  console.log("Launching auth flow…");
  const auth = await authenticate({
    keyfilePath: path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "../../../gcp-oauth.keys.json",
    ),
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  fs.writeFileSync(credentialsPath, JSON.stringify(auth.credentials));
  console.log("Credentials saved. You can now run the server.");
}

async function loadCredentialsAndRunServer() {
  if (!fs.existsSync(credentialsPath)) {
    console.error(
      "Credentials not found. Please run with 'auth' argument first.",
    );
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
  const auth = new google.auth.OAuth2();
  auth.setCredentials(credentials);
  google.options({ auth });

  console.log("Credentials loaded. Starting server.");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[2] === "auth") {
  authenticateAndSaveCredentials().catch(console.error);
} else {
  loadCredentialsAndRunServer().catch(console.error);
}