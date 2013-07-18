Ext.application({
    name:'setlist',
    appFolder:'setlist',
    launch:function () {
        var me = this;

        window.setListDB = openDatabase("set_list_db","1.0","Set List DB", 5*1024*1024,function(db){
            var initSql = {
                create : {
                    songs : "   CREATE TABLE IF NOT EXISTS songs (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, writer TEXT NOT NULL , time TEXT NOT NULL DEFAULT \"03:15\")",
                    setLists : "   CREATE TABLE IF NOT EXISTS set_lists (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, details TEXT NOT NULL , created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
                    songlist : "   CREATE TABLE IF NOT EXISTS song_lists (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, set_list_fk INTEGER NOT NULL, song_fk INTEGER NOT NULL)"
                }
            };
            console.log('ensuring tables');
            db.transaction(function(tx){
                Ext.Object.each(initSql.create, function(k,v){
                    console.log('Table: '+k+" - "+v);
                    tx.executeSql(v);
                });
            });
        });

        Ext.Loader.setConfig({
            enabled:true,
            disableCaching:true,
            paths:{
                'setlist':RCP + '/js/setlist'
            }
        });
        Ext.tip.QuickTipManager.init();
        Ext.util.History.init();
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        Ext.onReady(function () {
            Ext.util.History.on('change', function (token) {
                console.log("Updating History with token " + token);
                History.token = token;
                History.object = Ext.Object.fromQueryString(token || "");
            });
        });

        var onViewportRefresh = function(){
            var ms = Ext.StoreManager.get('master');
            var msd = localStorage.getItem('masterStoreData');
            if (msd!=null) try {
                var msl = JSON.parse(msd);
                ms.loadRawData(msl)
            } catch(e) {console.log(e);}
            Ext.getCmp('songForm').getForm().reset();
            Ext.getCmp('setList-viewport').down('songlist').store.removeAll();
        };

        var dropBox = Ext.create('Ext.container.Container',{
            xtype:'container',
            id : 'drop_zone_container',
            hidden : true,
            layout:'anchor',
            padding:'8',
            items:[{
                xtype : 'form', id : 'songForm',
                anchor : '100%', border:false,
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 40,
                    xtype : 'textfield'
                },
                items: [{
                    xtype: 'textfield',
                    anchor: '100%',
                    fieldLabel: 'Title',
                    name: 'title'
                },{
                    xtype:'container',layout:{type:'hbox'},defaultType:'textfield',anchor:'100%',defaults:{flex:1},
                    items : [{
                        fieldLabel: 'Writer',
                        name: 'writer',flex:2
                    },{
                        fieldLabel: 'Time',
                        name: 'time'
                    }]
                }],
                buttons : [
                    {text:'Clear',handler:function(){
                        var f = this.up('form').getForm();
                        f.reset();
                        f._record = null;
                    }},
                    {text:'Save',handler:function(){
                        var master = Ext.StoreManager.get('master');
                        var f = this.up('form'), r = f.getRecord();
                        var songSpec = f.getForm().getFieldValues();
                        if(r!=null) {
                            Ext.Object.each(songSpec,function(k,v){r.set(k,v);});
                            r.endEdit();
                        }
                        else master.add( Ext.create('setlist.model.Song',songSpec) );
                    }}
                ]
            },{
                xtype:'container',
                id:'drop_zone',
                anchor: '100%',
                height:60,
                padding:10,
                margin : '10 0 0 0',
                html:'Load songs to the master by dropping a CSV files here.<br/><br/>Format must be: <b>Title,Writer,Time</b>',
                listeners : {
                    render : {
                        fn:function(cnt){
                            if (window.File && window.FileReader && window.FileList && window.Blob) {
                                var handleFileSelect =function (evt) {
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    var files = evt.dataTransfer.files; // FileList of File objects. List some properties.
                                    var output = [];
                                    for (var i = 0, f; f = files[i]; i++) {
                                        var fileReader = new FileReader();
                                        fileReader.onload = function(e){
                                            viewport.loadMaster(e.target.result);
                                        };
                                        console.log('Reading File: '+ f.name+' ('+ f.size+')');
                                        var r = fileReader.readAsText(f);
                                        console.log('Returned: '+r);
                                    }
                                };
                                var handleDragOver = function (evt) {
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                                    console.log('Drag over');
                                };
                                console.log('File APIs are supported');
                                //var fdzd = Ext.get('drop_zone',true).dom;
                                var fdzd = cnt.getEl().dom;
                                fdzd.addEventListener('dragover', handleDragOver );
                                fdzd.addEventListener('drop', handleFileSelect );
                            } else {
                                console.log('HTML5 File APIs are not supported in this browser\n' +
                                    'So you won\'t be able to load files directly.\n' +
                                    'Try Google Chrome, Mozilla Firefox, Apple Safari, or Opera');
                                console.log('To try chrome, go to: https://www.google.com/intl/en/chrome/browser/index.html');
                                cnt.hide();
                            }
                        }
                    }
                }
            }],
            animSpec : {
                target: 'drop_zone_container',
                duration: 500,
                from: {
                    height: 10
                },
                to: {
                    height: 150
                }
            }
        });

        var viewport = Ext.create('Ext.container.Viewport', {
            layout:'fit',
            id : 'setList-viewport',
            items:[
                {
                    title:'<div class="app-title title">Set list manager</div>',
                    unstyled:true,
                    layout:{type:'hbox', align:'stretch'},
                    defaults:{flex:1, margin:'2',layout:'fit'},
                    tools : [{type:'refresh',handler:onViewportRefresh,margin:'2 5'}],
                    items:[
                        {
                            title:'Master',
                            id:'masterListPanel',
                            tools : [
                                {type:'save',handler:function(){
                                    var recs = [];
                                    Ext.StoreManager.get('master').each(function(r){recs.push(r.data);});
                                    localStorage.setItem('masterStoreData',JSON.stringify(recs));
                                }},
                                {type:'plus',handler:function(){
                                    var dz = Ext.getCmp('drop_zone_container');
                                    if(dz.isHidden()) {
                                        dz.show();
                                    } else {
                                        dz.hide();
                                    }
                                }},
                                {type:'minus',handler:function(){
                                    Ext.each(viewport.query('masterlist'),function(ml){
                                        var ma = ml.getSelectionModel().getSelection();
                                        ml.store.remove(ma);
                                    });
                                }}
                            ],
                            dockedItems : [
                                Ext.apply(dropBox,{dock:'top'})
                            ],
                            items:Ext.create('setlist.view.MasterList', {
                                multiSelect: true,
                                viewConfig:{
                                    plugins:{
                                        ptype:'gridviewdragdrop',
                                        dragText:'Drag and drop to reorganize',
                                        enableDrop:false,copy:true,
                                        dragGroup:'master',
                                        dropGroup:'songs'
                                    }
                                },
                                listeners : {
                                    itemdblclick : function(grid,rec,item,index){
                                        var f = dropBox.down('form'), r = f.getRecord();
                                        if(r) r.cancelEdit();
                                        dropBox.show();
                                        rec.beginEdit();
                                        f.loadRecord(rec);
                                    },
                                    render : onViewportRefresh                                }
                            }),
                            n:'f'
                        },{
                            title:'My Set',
                            id:'mySongSetView',
                            items:Ext.create('setlist.view.Songs', {
                                multiSelect: true,
                                tools : [{type:'minus',handler:function(){
                                    var g=this.up('grid'),
                                        s=g.getSelectionModel().getSelection();
                                    g.store.remove( s );
                                    Ext.StoreManager.get('master').add(s);
                                }}],
                                viewConfig:{
                                    plugins:{
                                        ptype:'gridviewdragdrop',
                                        dragText:'Drag and drop songs',
                                        dragGroup:'songs',
                                        dropGroup:'master'
                                    }
                                }
                            })
                        }
                    ]
                }
            ],
            loadMaster : function( content ){
                var masterStore = Ext.StoreManager.get('master');
                var songs = [];
                var lines = content.split(/\r\n|\n/);
                for(var l=1;l<lines.length;l++){
                    var parts = lines[l].split(/\t/);
                    var song = Ext.create('setlist.model.Song',{writer:parts[1],title:parts[0],time:parts[2]});
                    songs.push(song);
                }
                masterStore.add(songs);
                masterStore.writeToLocalStorage();
            },


            listeners:{
                afterrender:{
                    fn:function (app) {
                        //viewport.initDropZone(); // Check for the various File API support.
                    }
                }
            }
        });
    }
});