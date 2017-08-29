import retain
#import http as info


data=retain.readData()
#number_of_boxes=raw_input('Number of boxes: ').lower()

if(data[0]==0):

 import config 
 print("Initializing")
 counter=-1
 serviceInterval=1000
 client=raw_input("Client Name: ").lower()
 name=raw_input("Machine Name: ").lower()
 serial=raw_input("Serial Number: ").lower()
 location = raw_input("Location: ").lower()
 config.subTopic=config.subBaseURL+client+"/"+location+"/"+name+"/"+serial
 config.pubTopic=config.pubBaseURL+client+"/"+serial
 print("ini")

if(data[0]==1):

    import config
    print("Start After crash")
    counter = data[2]
    client=data[6]
    serviceInterval = data[5]
    name=data[1]
    serial=data[3]
    location = data[4]
    config.subTopic = config.subBaseURL + client + "/" + location + "/" + name + "/" + serial
    config.pubTopic = config.pubBaseURL + client + "/" + serial