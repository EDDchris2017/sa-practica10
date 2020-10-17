# Practicas Laboratorio Software Avanzado
## Segundo Semestre 2020
## Christopher Lopez 201504100
--------------------------------------------------
### Practica 10

#### LINK VIDEO : https://youtu.be/t1WEGS-69a8

#### Descripcion del Proyecto
Proyecto de Crowdsourcing donde se comunican diferentes microservicios para realizar comida
a domicilio
- Servicio Cliente: Microservicio que comienza el proceso de pedido y consume solamente web services del ESB
- Servicio ESB: Microservicio para el control de comunicacion entre los demas microservicios
redireccioando la informacion donde corresponde.
- Servicio Repartidor: Microservicio que recibe el pedido del restaurante para entregarlo al cliente.
- Servicio Restaurante: Procesa el pedido del cliente y realiza una solicitud a repartidor.

#### Herramientas utilizadas
Todos los microservicios fueron desarrollados en base a estas herramientas
- Lenguaje de programacion Node JS 12.8
- Manejo de paquetes NPM v 3.5

#### Construccion de Contenedores
Cada Microservicio dentro del proyecto tiene definido un DockerFile
que se contruye la imagen al levantar la plataforma con Docker compose
**Pasos que conforman el dockerFile
1. Uso de una imagen con node y npm instalado
2. Creacion de la carpeta /code dentro del contenedor
3. crear una carpeta /logs dentro del contenedor
4. copiar los archivos en la carpeta donde esta ubicada el dockerfile al contenedor
5. Inslacacion de dependencias con npm usando el package.json dentro del contenedor
6. Exponer su respectivo puerto
7. Ejecutar la aplicacion con node
```dockerfile
FROM node:latest
WORKDIR /code
RUN mkdir /logs
COPY . .
RUN npm install
EXPOSE 3004
CMD ["node", "ESB.js"]
```
#### Deployment de la aplicacion
- **Volumenes**Para verificar el funcionamiento de cada Microservicio cada uno escribi un archivo **.log** en una carpeta que se encuentra mapeada en la maquina local en una carpeta llamada /logs
- **Dockerfile** Cada contenedor se construye a partir de una imagen generada de los dockerfile ubicados en la cada carpeta del Microservicio
- Mapeo de puertos a la maquina local de acuerdo a los que estas definidos en el archivo .env
- **Levantar el archivo con sudo docker-compose up**
```yaml
version: "3.8"
services:
    esb:
        volumes:
            - ./logs:/logs
        ports:
            - "${ESB_PORT}:80"
        build: ./src/ESB
    restaurante:
        build: ./src/Restaurante
        volumes:
            - ./logs:/logs
        ports:
            - "${REST_PORT}:80"
    repartidor:
        build: ./src/Repartidor
        volumes:
            - ./logs:/logs
        ports:
            - "${REPART_PORT}:80"
    cliente:
        build: ./src/Cliente
        volumes:
            - ./logs:/logs
```

#### Archivos Logs
Al levantar la aplicacion con docker-compose los contenedores escriben archivos .log dentro de la carpeta /logs en la raiz del proyecto
** Esto es posible al mapear los volumenes. 
- clientelog.log
- historial_ESB.log
- repartidor.log
- restaurante.log
```txt
Servicio ESB: 3004
====================================
Pedido de Cliente al Restaurante
Redirigir respuesta a Restaurante
CLIENTE -> RESTAURANTE
====================================
====================================
Consultar estado de Cliente al Restaurante
Redirigir respuesta de estado a Restaurante
CLIENTE --> RESTAURANTE
====================================
====================================
Consultar estado de Cliente al Restaurante
Redirigir respuesta de estado a Restaurante
CLIENTE --> RESTAURANTE
```
#### Definicion de archivo .ENV
el archivo .env se definen los puertos que se quieren mapear de cada microservicio
a unos puertos de la maquina local.
