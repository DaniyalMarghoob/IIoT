import retain
import http as info


data=retain.readData()
#number_of_boxes=raw_input('Number of boxes: ').lower()

if(data[0]==0):

 import config 
 print("Initializing")
 #counter=-1
 counterSlide1=info.counter_values()[0]
 counterSlide2=info.counter_values()[1]
 serviceInterval=10000
 client=raw_input("Client Name: ").lower()
 name=info.info()[0]
 serial=info.info()[1]
 location = raw_input("Location: ").lower()
 config.subTopic=config.subBaseURL+client+"/"+location+"/"+name+"/"+serial
 config.pubTopic=config.pubBaseURL+client+"/"+serial
 print("ini")

if(data[0]==1):

    import config
    print("Start After crash")
    counterSlide1=info.counter_values()[0]
    counterSlide2=info.counter_values()[1]
    counter = data[2]
    client=data[6]
    serviceInterval = data[5]
    name=info.info()[0]
    serial=info.info()[1]
    location = data[4]
    config.subTopic = config.subBaseURL + client + "/" + location + "/" + name + "/" + serial
    config.pubTopic = config.pubBaseURL + client + "/" + serial
    