import ctypes
import http

import RPi.GPIO as gpio
ledWarning=18
ledOK=24
gpio.setwarnings(False)
gpio.setmode(gpio.BCM)
gpio.setup(ledOK,gpio.OUT)
gpio.output(ledOK,False)
gpio.setup(ledWarning,gpio.OUT)

import time
from datetime import datetime


def on_connect(client, userdata, flags, rc):
    gpio.output(ledOK,True)
    import config
    import values
    print("Connected with result code " + str(rc))
    
    

def on_message(client, userdata, msg):
    message=str(msg.payload)
    print(message)
    mess = message.split("'")
    manipulation(mess[0])
    
def on_disconnect(client, userdata, rc):
    gpio.output(ledOK,False) 
    if rc != 0:
        print("unexpected disconnection")
        client.connect("broker.hivemq.com", 1883, 8000)

def manipulation(changedInData):
     	import values
     	if (changedInData == 'changed'):
         http.reset()
         #values.counter=0
	 gpio.output(ledWarning,False)
	if(changedInData=='alert'):
         gpio.output(ledWarning,True)
         gpio.output(ledOK,False)


	 