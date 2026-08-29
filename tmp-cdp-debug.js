const PAGE_WS = 'ws://127.0.0.1:9222/devtools/page/F699218FD542D77C2351A03842CBA613';
const TARGET_URL = process.argv[2] || 'http://localhost:3000/';

const ws = new WebSocket(PAGE_WS);
let id = 1;
const pending = new Map();
const logs = [];

function send(method, params) {
  const msgId = id++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(msgId);
      reject(new Error(`Timeout: ${method}`));
    }, 15000);
    pending.set(msgId, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject,
    });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

function waitFor(method, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Wait timeout: ${method}`)), timeoutMs);
    const handler = (msg) => {
      if (msg.method === method) {
        clearTimeout(timer);
        resolve(msg);
      }
    };
    waiters.push(handler);
  });
}

const waiters = [];

ws.onopen = async () => {
  try {
    await send('Runtime.enable');
    await send('Console.enable');
    await send('Log.enable');
    await send('Page.enable');
    await send('Network.enable');

    const nav = send('Page.navigate', { url: TARGET_URL });
    const loaded = waitFor('Page.loadEventFired', 20000);
    await nav;
    await loaded;

    await new Promise((r) => setTimeout(r, 5000));

    const bodyRes = await send('Runtime.evaluate', {
      expression: 'document.body ? document.body.innerText.slice(0, 6000) : "NO BODY"',
      returnByValue: true,
    });
    const htmlRes = await send('Runtime.evaluate', {
      expression: `JSON.stringify({
        hasAppError: document.documentElement.outerHTML.includes("Application error"),
        title: document.title,
        href: location.href,
        nextError: document.querySelector("nextjs-portal") ? "has portal" : null
      })`,
      returnByValue: true,
    });

    console.log('---BODY TEXT---');
    console.log(bodyRes.result && bodyRes.result.result && bodyRes.result.result.value);
    console.log('---HTML CHECK---');
    console.log(htmlRes.result && htmlRes.result.result && htmlRes.result.result.value);
    console.log('---CONSOLE LOGS---');
    for (const log of logs) {
      const method = log.method;
      const params = log.params || {};
      if (method === 'Runtime.exceptionThrown') {
        const ex = params.exceptionDetails || {};
        console.log('EXCEPTION:', ex.text, ex.exception && ex.exception.description);
        if (ex.stackTrace) console.log('STACK:', JSON.stringify(ex.stackTrace, null, 2));
      } else if (method === 'Runtime.consoleAPICalled') {
        const args = (params.args || []).map((a) => a.value || a.description || a.type).join(' ');
        console.log('CONSOLE', params.type, args);
      } else if (method === 'Log.entryAdded') {
        console.log('LOG', JSON.stringify(params.entry));
      } else if (method === 'Console.messageAdded') {
        console.log('MSG', JSON.stringify(params.message));
      } else {
        console.log(method, JSON.stringify(params).slice(0, 500));
      }
    }
    ws.close();
    process.exit(0);
  } catch (err) {
    console.error('SCRIPT ERROR', err);
    process.exit(1);
  }
};

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg);
    pending.delete(msg.id);
    return;
  }
  for (const waiter of waiters) waiter(msg);
  if (
    msg.method &&
    (msg.method === 'Runtime.exceptionThrown' ||
      msg.method === 'Runtime.consoleAPICalled' ||
      msg.method === 'Log.entryAdded' ||
      msg.method === 'Console.messageAdded')
  ) {
    logs.push(msg);
  }
};

ws.onerror = (e) => {
  console.error('WS error', e);
  process.exit(1);
};
