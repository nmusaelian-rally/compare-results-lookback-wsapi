Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var iterationComboBox = Ext.create('Rally.ui.combobox.IterationComboBox',{
   		listeners:{
   			ready: function(combobox){
   				this._iterationRef = combobox.getRecord().get('_ref'); 
                                this._iterationOid = combobox.getRecord().get('ObjectID'); //use OID of iteration with snapshot store , not ref
                                 this._loadStories(this._iterationRef,this._iterationOid);
   			},
   			select: function(combobox){
                                this._iterationRef = combobox.getRecord().get('_ref');
                                this._iterationOid = combobox.getRecord().get('ObjectID'); 
                                this._loadStories(this._iterationRef,this._iterationOid);
   			},
   			scope: this  
   		}
   	});
        this.add(iterationComboBox);
        var that = this;
         var container = Ext.create('Ext.Container', {
            items: [
                {
                           xtype: 'text',
                           text: 'Select a store'
                },
                {
                            xtype  : 'rallybutton',
                            text      : 'use snapshot store',
                            id: 'b1',
                            margin: '10',
                            handler: function() {
                                    that._loadStoriesWithSnapshot(that._iterationOid);
                            }
                        },
                        
                        {
                            xtype  : 'rallybutton',
                            text      : 'use wsapi data store',
                            id: 'b2',
                            handler: function() {
                                     that._loadStoriesWithWsapiDataStore(that._iterationRef);
                            }
                        }
                ]
         });
         this.add(container);
    },
    
     _loadStories: function(iterationRef,iterationOid){
        console.log('select a store');
     },
   
  
     _loadStoriesWithSnapshot:function(iterationOid){
        console.log('loading stories for ', iterationOid);
        var myStore = Ext.create('Rally.data.lookback.SnapshotStore', {
                autoLoad:true,
                fetch    : ['Name','_UnformattedID','ScheduleState'],
                
                filters  : [{
                    property : '__At',
                    value    : 'current'
                },
                {
                    property : '_TypeHierarchy',
                    value    : 'HierarchicalRequirement'
                },
                {
                    property : 'Iteration',
                    value    : iterationOid
                }
                ],
                listeners: {
   			load: function(store,records,success){
   				console.log("loaded %i records", records.length);
                                this._onDataLoaded(myStore, records);
   			},
   			scope:this
   		}
        });         
    },
    
    _loadStoriesWithWsapiDataStore:function(iterationRef){
        console.log('loading stories for ', iterationRef);
   	
   	var myStore = Ext.create('Rally.data.WsapiDataStore',{
   		model: 'User Story',
   		autoLoad:true,
   		fetch: ['Name','ScheduleState','FormattedID'],
   		filters:[
   			{
   				property : 'Iteration',
   				operator : '=',
   				value : iterationRef
   			}
   		],
   		listeners: {
   			load: function(store,records,success){
   				console.log("loaded %i records", records.length);
   				this._onDataLoaded(myStore);
   			},
   			scope:this
   		}
   	});
    },
     _onDataLoaded: function(store,records){
                console.log('count',store.getCount());
                console.log('records',records);
     }
});