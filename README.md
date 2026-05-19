# CS4330 Server Side Final Project 
## Fitness App User Guide:

### Get Started:
*Note: This project is intended for operation on Google Chrome/Safari and may not act as expected on other browsers*
1. Open up a new terminal:
  - MacOS (Terminal)
  - Windows ([WSL](https://learn.microsoft.com/en-us/windows/wsl/install))
  - Linux (Terminal)
2. Navigate into the root directory
```bash
cd ...
```
3. Ensure [Python](https://www.python.org/downloads/) is installed on your environment
```bash
python3 --version
```
### Creating and Starting the Virtual Environment:
4. Create a virtual environment (venv) in the project
```bash
python3 -m venv venv
```
5. Start the virtual environment
```bash
source venv/bin/activate
```
6. Within the virtual environment, install the project packages
```bash
pip install requirements.txt
```
7. While remaining inside the virtual environment, start the local server
```bash
python3 app.py
```
### Start the Expo Project:
8. Within a new terminal, navigate to the app directory
```bash
cd .../fitness-app
```
9. Install dependencies
```bash
npm install
```
10. Start up the project
```bash
npx start expo
```
### Establish a Connection with a Proxy:
11. Within a new terminal, navigate to the root directory
```bash
cd ...
```
12. Download mkcert
```bash
# WSL
sudo apt install mkcert 

# MacOS
brew install mkcert 

# Linux
sudo apt install libnss3-tools
brew install mkcert
```
For further instructions, check out this [guide](https://github.com/FiloSottile/mkcert)

13. Install the local certificate authority
```bash
mkcert -install
```
14. Generate the SSL certificate
```bash
mkcert localhost
```
15. Start the proxy
```bash
npx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```
### If on WSL, you must also connect Windows to your local certificate authority in WSL
16. Open Powershell as an Administrator and run the following command with username replaced with your device username
```bash
certutil -addstore -f "Root" \\wsl$\Ubuntu\home\username\.local\share\mkcert\rootCA.pem
```
You should receive a message confirming that your certificate was added to the store. You will need to open the app in a new browser to ensure the changes take effect.