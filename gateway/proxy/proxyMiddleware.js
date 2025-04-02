import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const createServiceProxy = (serviceUrl) => {
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    cookieDomainRewrite: "",
    pathRewrite: (path, req) => path, // Forward full path
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(req.user, "ussseer");
        if (req.user && req.user.id) {
          proxyReq.setHeader("x-user-id", req.user.id); // Add user ID as a header
          // Add username as a header
        }
        if (req.body && !req.is("multipart/form-data")) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.write(bodyData);
        }
      },
      proxyRes: (proxyRes, req, res) => {
        let body = "";
        proxyRes.on("data", (chunk) => {
          body += chunk.toString();
        });
        proxyRes.on("end", () => {
          console.log("Proxy Response Body:", body);
        });

        // Forward the status code from proxyRes to res
        res.statusCode = proxyRes.statusCode;
      },
      error: (err, req, res) => {
        console.error("Proxy Error:", err);
        res.status(502).json({ error: "Service unavailable" });
      },
    },
  });
};
