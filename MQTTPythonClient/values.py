import retain
import http as info


data=retain.readData()
#number_of_boxes=raw_input('Number of boxes: ').lower()

if(data[0]==0):
 import config 
 print("Initializing")
 client=raw_input("Client Name: ").lower()
 location = raw_input("Location: ").lower()

 print("ini")

if(data[0]==1):

    import config
    print("Start After crash")
    counter = data[2]
    client=data[6]
    location = data[4]
    
 counterSlide1=info.counter_values()[0]
 counterSlide2=info.counter_values()[1]
 serviceInterval=10000
 name=info.info()[0]
 serial=info.info()[1]
 config.subTopic=config.subBaseURL+client+"/"+location+"/"+name+"/"+serial
 config.pubTopic=config.pubBaseURL+client+"/"+serial
