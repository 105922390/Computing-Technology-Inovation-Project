# Computing-Technology-Inovation-Project


## How to use phishing-checker-backend for development
* Install dependencies in the pyproject.toml file.
* Start the API server with `fastapi run server.py` (from withing the `phishing-checker-backed/` folder).
* Make a `GET` API request to `localhost:8000/` with Postman to test.
* To test a URL, make a `POST` request to `localhsot:8000/process-data` with the body contents:
```json
{
	"url": "www.example.com"
}
```
* In Postman, use the Body tab under the url bar.

## Backend rate limiting
The backend allows up to 5 requests per source IP in a 10 second window by default. Requests over the limit receive HTTP 503 with a `Retry-After` header. Set `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS` in the backend `.env` file to change these defaults.

## Frontend API endpoint
The frontend reads its backend URL from `VITE_API_BASE_URL`, configured once in `phishing-checker-app/src/services/api.js`. Copy `phishing-checker-app/.env.example` to `phishing-checker-app/.env`.