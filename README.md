# Pedilo - Back
Backend en node del proyecto Pedilo, proyecto destinado a la comercializacion p2p de comida por medio de red social mobile

## Instalar NVM
```sh
sudo apt install curl;
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash;
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; # This loads nvm
source ~/.bashrc;
```

## Instalar npm v16.16.0
```sh
nvm install v16.16.0;
nvm use v16.16.0;
```

## Instalar pm2
```sh
npm install pm2 -g
```

## Clonar proyecto
```sh
cd /works;
git clone git@github.com:cristianlescano/pedilo_back.git;
cd pedilo_back;
npm install;
```

## Ejecurtar proyecto en pm2
# En servidor productivo
```sh
pm2 start pm2.json;
```
# En desarrollo
```sh
pm2 start pm2.json;
```

## Comandos utiles de pm2
```sh
# List all processes:
pm2 list

# Act on them:
pm2 stop pm2.json
pm2 restart pm2.json
pm2 delete pm2.json
```
# Accediendo al sitio
Actualmente la ip del vps es "200.58.98.5", en caso de ser otra cambiarla, tambien comprobar que el puerto 3308 este abierto
http://200.58.98.5:3308/app/checkVersion
