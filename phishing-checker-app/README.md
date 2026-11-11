## Running the application
### Front End
cd .\phishing-checker-app\
npm install
npm run dev

### Back End
cd .\phishing-checker-backend\
python -m venv .venv
pip install -r requirements.txt
uvicorn server:app --reload

## Threat Model

Who would want to attack it?

- A cybercriminal who wants their phishing link to be rated as safe so that their targets trust it

- A phishing organisation who wants to run a campaign would want the service unavailable while they run their attacks

- A general attacker who scans for common web application vulnerabilities

What are they trying to achieve?

- Attackers my be trying to get a phishing url to be classified as legitimate in order to evade detection

- Attackers may try to learn what classifies a url as legitimate so they can create phishing urls to pass as legitimate

- Attackers may want to make the API slow or unavailable all together for users

What can they actually do?

- Attackers can send any request directly to the API using tools like curl, bypassing every front-end check, at any rate and with any input

- Attackers can enter very long or unusual URLs with unusual characters

- Attackers can repeatedly query and read the response as the trust score and the list of reasons reveal a lot about how the model actually makes decisions

- Attackers can probe the deployment for exposed endpoints (such as FastAPI's /docs), missing headers and outdated dependencies