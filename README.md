# Provisioning AWS
Update the package manager
`sudo apt-get update && sudo apt-get dist-upgrade -y`

Install the required build tools
`sudo apt-get install -y curl build-essential git-core`

Forward port 80 to port 3000, where the application runs
`sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000`

Persist the changes
`sudo apt-get install -y iptables-persistent`
This will ask if you want to keep IPv4 and IPv6 entries, say yes to both.

Install NVM
`curl https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash`

Refresh with the NVM information stored in profile
`source ~/.profile`

Install Node v6
`nvm install 6`
`nvm alias default 6`

Install Forever
`npm install -g forever`

# Running Assignment
## Copy
Copy the files into the AWS instance

## Install Dependencies
`cd assn03`
`npm install`

## Logging
Defaults to logging to `app.log` in the `assn03` directory
With `NODE_ENV=local`, will log to stdout

## Development
To start a local server that reloads when changes are made on port 3000,
`npm run dev`

## Deployment
To start a server on port 3000
`npm start`

## Deploying using Forever
To ensure the server will always run,
`forever start app.js`
