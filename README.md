# Concept of Industrial Internet of Things

This code is an example of basic understanding of application layer protocols for machine to machine communication.
Code is structured in two directories where MQTTNodeClient represents the server side developement and MQTTPythonClient represents machine side configuration.
Protocols used for this projects are HTTP and MQTT.
Languages used for this project are Node.js and Python.
Server side is based on MVC pattern where as front end is an illustration of SPA.
No SQL database is used for data storage.

Modules:
Following are the modules and dependencies used for development in this project.
Node modules: mongoose, passport, local strategy, mqtt
Python modules: paho-mqtt,http, xlsxwriter, gpiozero, openpyxl

Installation:
Use following commands to install any module or dependecy
Node: npm install <module-name>, to install all the dependencies at use npm install 
Python: pip install <depency-name> or sudo pip install <depency-name>

Running:
Python client starts clientpub.py souce file where as node client starts from www source file present in bin directory.
To start python client open terminal and type python clientpub.py and to start node client redirect to bin directory in MQTTNodeClient and type node www or start www
