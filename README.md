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