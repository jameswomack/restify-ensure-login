# 2.0.1

  - Fix the 401 response on ajax requests to call send() rather than simply setting the status (which can be overriden by later handlers in the chain)

## 2.0.0

  - Send a 401 (unauthorized) instead of redirecting to login when we detect that the request is an XHR
