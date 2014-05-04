$(document).ready(function() {
    var self = this;
    var currentDataObject;
    this.viewModel = {
        
        //Model for the general page
        message:ko.observable('Server Configuration Wizard'),
        vendors:ko.observableArray(['Cisco(IOS)', 'juniper', 'nortel']),
        vendor: ko.observable(""),
        hostname: ko.observable(""),
        ip: ko.observable(""),
        subnetMask: ko.observable('255.255.255.255'),
        defaultGateway: ko.observable(''),
        routingEnabled: ko.observableArray(['yes', 'no']),
        routingChoice : ko.observable(""),
        managementVlan: ko.observable('1'),
        stack: ko.observableArray(['no', 'yes']),
        stackChoice: ko.observable(""),
        
        //Ports Model
        newPort : ko.observable(),
        ports: ko.observableArray([
            {intName: '', descr: '', speed: 'auto', duplex: 'auto', vlansNo: '', tagging: 'n', nativeVlanNo: '', portMode: 'portfast'},
        ]),
        
        //stp model;
        stpOptions : ko.observableArray(['STP', 'Rapid STP']),
        stpChoice : ko.observable(""),
        bridgePriority : ko.observable(""),
        
        //vlan model    
        vlanBool : ko.observableArray(['yes', 'no']),    
        vlanBoolChoice : ko.observable(""),
        
        vlans : ko.observableArray([{no: 1, name : "" , gateway : "", subnetMask : ""}]),
        
        vrrps : ko.observableArray([{vlanNo: 1, vlanGroup : 1, redundancyIp : "", redundancyPriority: "", redundancyPreemption: "n"}]),
        vrrpOptions : ko.observableArray(['no', 'yes']),
        vrrpOptionsChoice : ko.observable(),
        
        storedProjects : ko.observableArray(),
        
        deleteStoredItem : function(e) {
            console.log(e.itemKey);
            localStorage.removeItem(e.itemKey);
            getListOfStoredProjects();
            return false;
        }
    }
        
    //self.viewModel.file(self.viewModel.message() + self.viewModel.hostname()                
    //);
    
    

    $('#download').click(function() {    
        var object = mapToObject();
        $("#exportFile").text(object);
        document.location.hash = '#file';
    });
    
    $('#addPort').click( function() {
        var ports = (self.viewModel.ports());
        ports.push({intName: '', descr: '', speed: 'auto', duplex: 'auto', vlansNo: '', tagging: 'n', nativeVlanNo: '', portMode: 'portfast'});
        self.viewModel.ports(ports);
    });
    
    $('#addVlan').click( function() {
        var vlans = (self.viewModel.vlans())
        vlans.push({no: vlans.length + 1, name : "" , gateway : "", subnetMask : ""});
        self.viewModel.vlans(vlans);
    });
    
    $('#addVrrp').click( function() {
        var vrrps = (self.viewModel.vrrps())
        vrrps.push({vlanNo: vrrps.length + 1 , vlanGroup : vrrps.length + 1, redundancyIp : "", redundancyPriority: "", redundancyPreemption: "n"});
        self.viewModel.vrrps(vrrps);
    });
    
    $('#saveToStorage').click( function() {
        var name = $('#storageName').val();
        if (!currentDataObject) {
            alert("Please select your settings and click update before saving")
        } else {
            if (name && name != "") {
                putInStorage(name);
                
            } else {
                alert("Please enter a name");
            }
            $('#storageName').val('');
        }

        
    });
    
    function mapToObject() {
            currentDataObject = {},
            allPorts = self.viewModel.ports(),
            allVlans = self.viewModel.vlans(),
            allVrrps = self.viewModel.vrrps();
  
        currentDataObject.vendor = self.viewModel.vendor();
        currentDataObject.hostname = self.viewModel.hostname();
        currentDataObject.ip = self.viewModel.ip();
        currentDataObject.subnetMask = self.viewModel.subnetMask();
        currentDataObject.routingChoice = self.viewModel.routingChoice();
        currentDataObject.managementVlan = self.viewModel.managementVlan();
        currentDataObject.stackChoice = self.viewModel.stackChoice();
        
        currentDataObject.ports = [];
        
        currentDataObject.stpChoice = self.viewModel.stpChoice();
        currentDataObject.bridgePriority = self.viewModel.bridgePriority();
        
        //process the ports...
        if (allPorts.length > 0) {
            for(var i = 0; i < allPorts.length; i++) {
                currentDataObject.ports.push(allPorts[i])
            }
        }
        
        currentDataObject.vlans = [];
        
        //process the ports...
        if (allVlans.length > 0 && self.viewModel.vlanBoolChoice() === "yes") {
            for(var i = 0; i < allVlans.length; i++) {
                currentDataObject.vlans.push(allVlans[i]);
            }
        }
        
        currentDataObject.vrrps = [];
        
        //process the ports...
        if (allVrrps.length > 0 && self.viewModel.vrrpOptionsChoice() === "yes") {
            for(var i = 0; i < allVrrps.length; i++) {
                currentDataObject.vrrps.push(allVrrps[i]);
            }
        }
        
        console.log("****** This is the raw object *****");
        console.log("===================================");
        console.log(currentDataObject);
        
        console.log("****** This is the string object *****");
        console.log("===================================");
        console.log(JSON.stringify(currentDataObject));
        
        return JSON.stringify(currentDataObject, null, "\t");
    }
    
    //TODO: put this in a local storage session and get from it
    function mapFromObject() {
    }
    
    //mapFromObject();
    var valuesStored = [];
    
    //keep seesion up to date
    function putInStorage(storageName) {
        var keyNamespace = "generatorStorage.",
            value = JSON.stringify(currentDataObject),
            key = keyNamespace + storageName,
            keyExists = localStorage.getItem(key);
            
        if (keyExists) {
            alert("cannot overwrite this item, please choose a different name");
        } else {
            localStorage.setItem(key, value);
            getListOfStoredProjects();
        }
        
    }
    
    function getListOfStoredProjects() {
        var tempArray = [];
        if (localStorage.length > 0 ) {
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf("generatorStorage") === 0) {
                    var key = localStorage.key(i);
                    var item = localStorage.getItem(localStorage.key(i))
                    var storageObject = {};
                    storageObject.itemKey =  key;
                    storageObject.storedJson = item;
                    
                    tempArray.push(storageObject);
                }
            }
        }
        self.viewModel.storedProjects(tempArray);
    }
    
    getListOfStoredProjects();
    
    ko.applyBindings(self.viewModel);
});