import requests

BASE_URL = "http://127.0.0.1:8000"  

response = requests.get(f"{BASE_URL}/")
print("GET response:", response.json())

dataSendTest = {"url": "en.wikipedia.org/wiki/Phishing"}
response = requests.post(f"{BASE_URL}/process-data", json=dataSendTest)
print("POST response:", response.json())

#"en.wikipedia.org/wiki/Phishing"
#"paypal.com@secure-login.tk/verify"