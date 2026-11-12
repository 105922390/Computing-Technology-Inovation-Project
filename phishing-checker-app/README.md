## Running the application
### Front End
Rename the `.env.example` file to `.env`. This should contain the link to the backend server, and the default value should work correctly.

#### Running

`cd .\phishing-checker-app\`

`npm install`

`npm run dev`

Go to `http://localhost:5173`, or whatever link the vite server tells you the page is running at.

### Back End
Rename the `.env.example` file to `.env`. Leave populated entries as they are. The value `SESSION_SECRET_KEY` should be assigned to a random string for security, though any string will do for testing purposes. Make sure to include quotation marks. e.g.:

```plaintext
SESSION_SECRET_KEY="YOUR_KEY"
```
For security reason, don't use that exact value.

#### Running
`cd .\phishing-checker-backend\`

`python -m venv .venv`

`pip install -r requirements.txt`

`uvicorn server:app --reload`

### Database
In order for the user management system to work, you must set up and run a MySQL database server. One that is local on your device will work and is recommended. We used `10.4.32-MariaDB`, though other versions may work. For development, we used the tool XXAMP to run the MySQL server. Given the variety of methods and complexity of setting this up, we cannot provide comprehensive installation instructions as this is outside the scope of our assignment. Please see here for the XXAMP download, though you don't have to use this tool: https://www.apachefriends.org/download.html

Once your MySQL server is running, download the `phishing_url_checker.sql` file from the root directory and run the script in your instance of MySQL.

Place your database connection details in the `.env` file of the backend, including the host, port, username, and password. The database name should already be configured.


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

## Security Measures To Be Marked

### SQL Injection

Without protection against SQL injection, writing the following into the 'Username' field of the login screen would delete the users table of the database:
`test"; DROP TABLE user; COMMIT; -- `

Given that this is obviously behaviour that users should not have access to, it is important to protect against SQL injections.
We do this in our program by using prepared statements in python that sanitise the input so the SQL engine treats the input as a string, not as commands.

### Denial of Service (DoS)

Without security protecting against DoS attacks, a malicious actor could send requests to the server constantly, overwhelming it as it tried to process and respond to all of them. This has the side effect of slowing if not stopping the service for legitimate users.

To protect against this, we implemented a system of rate limiting that, when more than 5 requests come from a single IP address within a 10 second window, any other requests are immediately rejected with a 503: Service Unavailable error. This drastically lightens the load for the server and ensures regular users experience no slow-down.

### Login Timing Side Channel

Before this was implemented, a call to the API endpoint `/log-in` would have the following response times. (Real data points)

| Username | Is the username in the database? | Response Time |
|--|--|--|
| `john` | Yes | `110ms` |
| `alice` | No | `9ms` |

This reveals to an attacker that there is a user named "john" in the database, as more work had to be done to check if the given credentials were valid, specifically, verifying the hashed passwords. To fix this, when the username is not in the database, the supplied password is verified against a dummy password regardless, so both code paths take the same amount of time. These are the results after the fix:

| Username | Is the username in the database? | Response Time |
|--|--|--|
| `john` | Yes | `87ms` |
| `alice` | No | `95ms` |

Accounting for the standard deviation of these values, the status of a given username in the database is now no longer exposed to an attacker.

#### What does this cost?

This makes all login attempts marginally slower, however only by `~100ms`, which is largely unnoticable to users, especially when it can take longer than that to just load the page itself, and only on the log-in screen, **not** sitewide . This makes this security deployment a well-worth trade off.

## Dependency Versions
The backend was developed with Python 3.14, and the frontend with React v19.3.0. For entire dependencies, see `requirements.txt` in the backend and `package.json` in the frontend. 

## Generative AI Statement
The output of generative AI was not used for our project and the entire outputs of generative AI are not present in the project.