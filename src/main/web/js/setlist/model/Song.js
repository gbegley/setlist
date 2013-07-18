Ext.define('setlist.model.Song',{
    extend :'Ext.data.Model',
    idProperty:'title',
    fields : [
        {name:'writer'},
        {name:'title'},
        {name:'time'}
    ]
});