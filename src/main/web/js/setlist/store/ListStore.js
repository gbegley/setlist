Ext.define('setlist.store.ListStore',{
    requires : ['setlist.model.SetList'],
    extend : 'Ext.data.Store',
    model : 'setlist.model.SetList',
    storeId : 'SetListStore',
    data : [
        {name:'Master'},
        {name:'New Hope'},
        {name:'Dive Bar'},
        {name:'Sweet thing'}
    ]
});