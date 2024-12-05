import { RSocketConnector } from "@sjerman/rsocket-core";
import { WebsocketClientTransport } from "@sjerman/rsocket-websocket-client";

(async () => {
  const outputDiv = document.querySelector("#output");

  const connector = new RSocketConnector({
    transport: new WebsocketClientTransport({
      url: "ws://localhost:9090",
      wsCreator: (url) => new WebSocket(url),
    }),
  });

  const rsocket = await connector.connect();

  rsocket.requestResponse(
    {
      data: Buffer.from("Hello World"),
    },
    {
      onError: (e) => reject(e),
      onNext: (payload, isComplete) => {
        const div = document.createElement("div");
        div.textContent = `[${new Date().toISOString()}] payload[data: ${
          payload.data
        }; metadata: ${payload.metadata}]|${isComplete}`;
        outputDiv.appendChild(div);
      },
      onComplete: () => {
        const div = document.createElement("div");
        div.textContent = `Stream completed...`;
        outputDiv.appendChild(div);
      },
      onExtension: () => {},
    }
  );
})();
