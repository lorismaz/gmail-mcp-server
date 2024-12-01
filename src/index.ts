import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Gmail API credentials
const CREDENTIALS = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI,
};

const oauth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// MCP Server implementation
app.get('/api/v1/context', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Check if we have valid authentication
    if (!oauth2Client.credentials.access_token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Search emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: q as string,
      maxResults: 10
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

    return res.json({
      results: emails.map(email => ({
        content: email.snippet,
        metadata: {
          source: 'gmail',
          id: email.id,
          headers: email.headers
        }
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auth endpoints
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly']
  });
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful! You can now use the API.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});