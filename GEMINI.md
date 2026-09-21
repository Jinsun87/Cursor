# Project Guidelines: Lampstand

## Paddle Integration

When writing or modifying code that integrates with Paddle:

- Always check current Paddle documentation via the `paddle-docs` MCP server before suggesting code. The Paddle API and SDKs evolve frequently — do not rely on training data alone.
- Use the official Paddle SDK for the language in use:
  - Node.js & Next.js client → `@paddle/paddle-js`
  - Node.js & Next.js server → `@paddle/paddle-node-sdk`
- All development uses the sandbox environment. Sandbox API keys contain `_sdbx`; sandbox client-side tokens are prefixed with `test_`.
- Always verify webhook signatures before acting on the payload:
  - Node: `paddle.webhooks.unmarshal(rawBody, secret, signature)`
- For destructive account changes (updating prices, archiving products, canceling subscriptions), ask for explicit confirmation before calling the `paddle-sandbox` or `paddle-live` MCP server.
- Use `paddle-sandbox` by default. Only call `paddle-live` when the prompt explicitly mentions live, production, or real customer data.
- API keys and webhook secrets live in environment variables — never inline credentials into code.
