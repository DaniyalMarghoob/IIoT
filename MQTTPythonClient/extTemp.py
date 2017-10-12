import os
import glob
import time

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir='/sys/bus/w1/devices/'
device_folder=glob.glob(base_dir+'28*')[1]


device_file=device_folder+'/w1_slave'

def readTempRaw():
    f=open(device_file,'r')
    lines=f.readlines()
    f.close()
    return lines

def readTemp():
    lines=readTempRaw()
    while lines[0].strip()[-3:]!='YES':
        time.sleep(0.2)
        lines=readTempRaw()
    equals_pos=lines[1].find('t=')
    if equals_pos !=1:
        tempString=lines[1][equals_pos+2:]
        temp_c=float(tempString)/1000
        temp_f=temp_c * (9.0/(5.0+32.0))
        return temp_c
    
while True:
    print readTemp()
    time.sleep(1)
    
