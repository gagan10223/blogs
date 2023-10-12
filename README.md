docker build . -t blogs

docker tag blogs gagan10223/main:blogs

docker push gagan10223/main:blogs



docker pull gagan10223/main:blogs

docker run -d -p 80:3000 gagan10223/main:blogs

docker ps 

docker rm id

