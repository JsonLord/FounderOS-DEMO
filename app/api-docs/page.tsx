import Link from 'next/link';

export default function ApiDocsPage() {
  const endpoints = [
    { method: 'GET', path: '/health', purpose: 'Health check endpoint for space monitoring and readiness probes.', request: 'None', response: '{"status": "ok"}' },
    { method: 'GET', path: '/api/agents', purpose: 'List all agents grouped by department and overall metrics.', request: 'None', response: '{"agents": [...]}' },
    { method: 'POST', path: '/api/agents/[id]/run', purpose: 'Execute a specific agent by ID and store execution results.', request: 'None', response: '{"id": "...", "ok": true, "summary": "..."}' },
    { method: 'POST', path: '/api/agents/broadcast', purpose: 'Broadcast a prompt/message to all runtime agents concurrently.', request: '{"message": "Status update"}', response: '{"id": "...", "replies": [...]}' },
    { method: 'POST', path: '/api/conductor/chat', purpose: 'Route prompt through Conductor super-agent to sub-agents.', request: '{"message": "Check sales"}', response: '{"routedTo": "...", "reply": "..."}' },
    { method: 'GET', path: '/api/comms', purpose: 'Fetch aggregated communications feed (Email, Slack, WhatsApp, DMs).', request: 'None', response: '{"feed": [...]}' },
    { method: 'POST', path: '/api/comms/reply', purpose: 'Send a reply to a communication item.', request: '{"id": "...", "reply": "..."}', response: '{"ok": true}' },
    { method: 'GET', path: '/api/connections', purpose: 'Get live connection status for all 20+ connector groups.', request: 'None', response: '{"connections": [...]}' },
    { method: 'GET', path: '/api/brain', purpose: 'Query G-Brain hybrid knowledge graph vector & keyword store.', request: 'GET /api/brain?q=query', response: '{"results": [...]}' },
    { method: 'GET', path: '/api/social', purpose: 'Fetch social channel audience snapshots and growth metrics.', request: 'None', response: '{"snapshots": [...]}' },
    { method: 'POST', path: '/api/social/dm/reply', purpose: 'Send direct message reply via ManyChat connector.', request: '{"platform": "instagram", "subscriberId": "...", "text": "..."}', response: '{"ok": true}' },
    { method: 'GET', path: '/api/finances', purpose: 'Retrieve financial ledger summaries, category breakdowns, and totals.', request: 'None', response: '{"summary": {...}}' },
    { method: 'GET', path: '/api/funnel', purpose: 'Retrieve living client journey pipeline contacts and touches.', request: 'None', response: '{"journeys": [...]}' },
    { method: 'POST', path: '/api/webhooks/manychat', purpose: 'Inbound webhook ingesting direct messages from ManyChat.', request: 'Webhook payload', response: '{"ok": true}' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Founder OS — API Documentation</h1>
      <p className="text-sm text-gray-400 mb-8">Comprehensive API Reference for single-operator command center endpoints.</p>

      <div className="space-y-6">
        {endpoints.map((ep) => (
          <div key={ep.path + ep.method} className="border border-gray-800 bg-gray-950 p-4 rounded">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${ep.method === 'GET' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'}`}>
                {ep.method}
              </span>
              <span className="font-bold text-sm">{ep.path}</span>
            </div>
            <p className="mt-2 text-xs text-gray-300">{ep.purpose}</p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Request Example:</span>
                <pre className="bg-black p-2 rounded text-gray-400 overflow-x-auto">{ep.request}</pre>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Response Example:</span>
                <pre className="bg-black p-2 rounded text-gray-400 overflow-x-auto">{ep.response}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-gray-500">
        <Link href="/" className="underline hover:text-gray-300">← Back to Command Center</Link>
      </div>
    </div>
  );
}
