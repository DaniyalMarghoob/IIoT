import paho.mqtt.client as mqtt
import retain
import os
from datetime import datetime
import random
import string
import json
import time

import http
import callbacks
import config
import values

client = mqtt.Client()
client.on_connect = callbacks.on_connect
client.on_message = callbacks.on_message
client.on_disconnect=callbacks.on_disconnect
client.connect(config.broker, config.port, 8000)
client.subscribe(config.subTopic,0)

client.loop_start()
while 1:
    #values.counter+=1
    #serviceInterval = values.serviceInterval - values.counter
    
    location=values.location
    send_msg = {
        'client':values.client,
        'name': values.name,
        'counter': http.counter_values()[0],
        #'counterSlide2': values.counterSlide2,
        'serial': values.serial,
        'location': values.location,
        'serviceInterval': values.serviceInterval,
	'cpuTemperature':retain.cpuTemp(),
        'envTemperature':retain.envTemperature(),
        'machineTemperature':retain.machineTemperature()
    }
    client.publish(config.pubTopic, payload=json.dumps(send_msg), qos=2, retain=False)
    data=[1,values.name,values.counterSlide1,values.serial,values.location,values.serviceInterval,values.client,values.counterSlide2]

    retain.writeData(data)
    print(str(send_msg))
    time.sleep(5)


client.loop_forever()

