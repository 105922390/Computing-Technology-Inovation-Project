# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

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