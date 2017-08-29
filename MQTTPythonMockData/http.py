import urllib
import urllib2
import json

number_of_boxes='2'#values.number_of_boxes
base_url="http://10.186.81.184/slide"
headers={'Content-Type':'application/json'}

def counter_values():
    url=[]
    payload={"cmd":"get_state"}
    for num in range(1,int(number_of_boxes)+1):
        url_slide=base_url+str(num)+"/command"
        req=urllib2.Request(url_slide,json.dumps(payload))
        res=urllib2.urlopen(req).read()
        msg=json.loads(res)
        url.append(msg['fixture_counter'])
    return url

def info():
    ns=[]
    url=base_url+str(1)+"/command"
    payload={"cmd":"get_info"}
    req=urllib2.Request(url,json.dumps(payload))
    res=urllib2.urlopen(req).read()
    msg=json.loads(res)
    ns.append(msg['test_station_type'])
    ns.append(msg['serial_number'])
    return ns

def reset():
    url='http://10.186.81.184/Settings/Jot/index.html?fixturecounter=0'
    header={'Authorization':'Basic Sm90OkF1dG9tYXRpb24='}
    req=urllib2.Request(url,None,header)
    res=urllib2.urlopen(req).read()
    
    
